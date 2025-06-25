import { IStorage } from './storage';

export interface AnalyticsData {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    userGrowthRate: number;
  };
  projectStats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    projectsByStatus: Record<string, number>;
    averageProjectDuration: number;
  };
  engagementStats: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    averageSessionDuration: number;
    pageViews: number;
  };
  revenueStats: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageProjectValue: number;
    revenueGrowthRate: number;
  };
  timeSeriesData: {
    userRegistrations: Array<{ date: string; count: number }>;
    projectCreations: Array<{ date: string; count: number }>;
    revenue: Array<{ date: string; amount: number }>;
  };
}

export class AnalyticsService {
  constructor(private storage: IStorage) {}

  async getAnalyticsData(): Promise<AnalyticsData> {
    const users = await this.storage.getAllUsers();
    const projects = await this.storage.getAllProjects();
    
    // Calculate time ranges
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // User statistics
    const newUsersThisMonth = users.filter(u => 
      new Date(u.createdAt || now) >= oneMonthAgo
    ).length;

    const userStats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.role !== 'inactive').length,
      newUsersThisMonth,
      userGrowthRate: users.length > 0 ? (newUsersThisMonth / users.length) * 100 : 0
    };

    // Project statistics
    const projectsByStatus = projects.reduce((acc, project) => {
      const status = project.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const completedProjects = projects.filter(p => p.status === 'completed');
    const activeProjects = projects.filter(p => 
      ['in_progress', 'pending', 'review'].includes(p.status || 'pending')
    );

    // Calculate average project duration for completed projects
    const averageProjectDuration = completedProjects.length > 0
      ? completedProjects.reduce((sum, project) => {
          const start = new Date(project.createdAt || now);
          const end = new Date(project.updatedAt || now);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / completedProjects.length
      : 0;

    const projectStats = {
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      projectsByStatus,
      averageProjectDuration
    };

    // Engagement statistics (simulated for demo)
    const engagementStats = {
      dailyActiveUsers: Math.floor(users.length * 0.3),
      weeklyActiveUsers: Math.floor(users.length * 0.6),
      averageSessionDuration: 1800, // 30 minutes in seconds
      pageViews: projects.length * 10 + users.length * 5
    };

    // Revenue statistics (simulated based on projects)
    const totalRevenue = projects.reduce((sum, project) => {
      const estimatedValue = this.estimateProjectValue(project);
      return sum + (project.status === 'completed' ? estimatedValue : 0);
    }, 0);

    const monthlyRevenue = projects
      .filter(p => new Date(p.createdAt || now) >= oneMonthAgo)
      .reduce((sum, project) => {
        const estimatedValue = this.estimateProjectValue(project);
        return sum + (project.status === 'completed' ? estimatedValue : 0);
      }, 0);

    const revenueStats = {
      totalRevenue,
      monthlyRevenue,
      averageProjectValue: projects.length > 0 ? totalRevenue / projects.length : 0,
      revenueGrowthRate: totalRevenue > 0 ? (monthlyRevenue / totalRevenue) * 100 : 0
    };

    // Time series data
    const timeSeriesData = {
      userRegistrations: this.generateTimeSeriesData(users, 'createdAt', 30),
      projectCreations: this.generateTimeSeriesData(projects, 'createdAt', 30),
      revenue: this.generateRevenueTimeSeriesData(projects, 30)
    };

    return {
      userStats,
      projectStats,
      engagementStats,
      revenueStats,
      timeSeriesData
    };
  }

  private estimateProjectValue(project: any): number {
    // Estimate project value based on type and complexity
    const baseValues = {
      'web_development': 5000,
      'mobile_app': 8000,
      'design': 3000,
      'consulting': 2000,
      'other': 1000
    };

    const projectType = project.type || 'other';
    const baseValue = baseValues[projectType as keyof typeof baseValues] || baseValues.other;
    
    // Add some randomness for demo purposes
    return baseValue + (Math.random() * 2000 - 1000);
  }

  private generateTimeSeriesData(
    items: any[], 
    dateField: string, 
    days: number
  ): Array<{ date: string; count: number }> {
    const data: Array<{ date: string; count: number }> = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = items.filter(item => {
        const itemDate = new Date(item[dateField] || now);
        return itemDate.toISOString().split('T')[0] === dateStr;
      }).length;

      data.push({ date: dateStr, count });
    }

    return data;
  }

  private generateRevenueTimeSeriesData(
    projects: any[], 
    days: number
  ): Array<{ date: string; amount: number }> {
    const data: Array<{ date: string; amount: number }> = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayProjects = projects.filter(project => {
        const projectDate = new Date(project.createdAt || now);
        return projectDate.toISOString().split('T')[0] === dateStr;
      });

      const amount = dayProjects.reduce((sum, project) => {
        return sum + (project.status === 'completed' ? this.estimateProjectValue(project) : 0);
      }, 0);

      data.push({ date: dateStr, amount });
    }

    return data;
  }

  async getProjectAnalytics(projectId: string) {
    const project = await this.storage.getProjectById(projectId);
    if (!project) return null;

    const timeline = project.timeline || [];
    const totalDuration = timeline.length > 0 
      ? new Date().getTime() - new Date(project.createdAt || new Date()).getTime()
      : 0;

    return {
      project,
      duration: Math.floor(totalDuration / (1000 * 60 * 60 * 24)), // days
      timelineEvents: timeline.length,
      status: project.status,
      estimatedValue: this.estimateProjectValue(project),
      completionRate: this.calculateProjectCompletionRate(project)
    };
  }

  private calculateProjectCompletionRate(project: any): number {
    const timeline = project.timeline || [];
    if (timeline.length === 0) return 0;

    const completedEvents = timeline.filter((event: any) => 
      event.completed || event.status === 'completed'
    ).length;

    return (completedEvents / timeline.length) * 100;
  }
}