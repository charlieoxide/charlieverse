import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

interface NotificationData {
  type: 'project_update' | 'user_action' | 'admin_action' | 'system_alert';
  title: string;
  message: string;
  userId?: string;
  projectId?: string;
  timestamp: Date;
  data?: any;
}

class WebSocketManager {
  private io: Server;
  private connectedUsers: Map<string, string> = new Map(); // socketId -> userId

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('authenticate', (userId: string) => {
        this.connectedUsers.set(socket.id, userId);
        socket.join(`user_${userId}`);
        console.log(`User ${userId} authenticated with socket ${socket.id}`);
      });

      socket.on('join_admin_room', () => {
        socket.join('admin_room');
        console.log(`Socket ${socket.id} joined admin room`);
      });

      socket.on('disconnect', () => {
        const userId = this.connectedUsers.get(socket.id);
        if (userId) {
          this.connectedUsers.delete(socket.id);
          console.log(`User ${userId} disconnected`);
        }
      });
    });
  }

  // Send notification to specific user
  sendToUser(userId: string, notification: NotificationData) {
    this.io.to(`user_${userId}`).emit('notification', notification);
  }

  // Send notification to all admins
  sendToAdmins(notification: NotificationData) {
    this.io.to('admin_room').emit('notification', notification);
  }

  // Send notification to all connected users
  broadcast(notification: NotificationData) {
    this.io.emit('notification', notification);
  }

  // Send project update to specific user and admins
  sendProjectUpdate(projectId: string, userId: string, update: any) {
    const notification: NotificationData = {
      type: 'project_update',
      title: 'Project Update',
      message: `Your project ${update.title || projectId} has been updated`,
      userId,
      projectId,
      timestamp: new Date(),
      data: update
    };

    this.sendToUser(userId, notification);
    this.sendToAdmins(notification);
  }

  // Send user action notification to admins
  sendUserAction(action: string, userId: string, data?: any) {
    const notification: NotificationData = {
      type: 'user_action',
      title: 'User Action',
      message: `User action: ${action}`,
      userId,
      timestamp: new Date(),
      data
    };

    this.sendToAdmins(notification);
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get online status of specific user
  isUserOnline(userId: string): boolean {
    return Array.from(this.connectedUsers.values()).includes(userId);
  }
}

export default WebSocketManager;