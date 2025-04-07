// src/websockets/websockets.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebsocketsService {
  // Map to store user ID to socket ID
  private userSocketMap: Map<string, string> = new Map();
  // Map to store socket ID to user ID (for reverse lookup)
  private socketUserMap: Map<string, string> = new Map();

  addUser(userId: string, socketId: string): void {
    this.userSocketMap.set(userId, socketId);
    this.socketUserMap.set(socketId, userId);
  }

  removeUser(userId: string): void {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.socketUserMap.delete(socketId);
    }
    this.userSocketMap.delete(userId);
  }

  removeUserBySocketId(socketId: string): void {
    const userId = this.socketUserMap.get(socketId);
    if (userId) {
      this.userSocketMap.delete(userId);
    }
    this.socketUserMap.delete(socketId);
  }

  getUserSocketId(userId: string): string | undefined {
    return this.userSocketMap.get(userId);
  }

  getUserIdBySocketId(socketId: string): string | undefined {
    return this.socketUserMap.get(socketId);
  }

  isUserOnline(userId: string): boolean {
    return this.userSocketMap.has(userId);
  }

  getOnlineUsers(): string[] {
    return Array.from(this.userSocketMap.keys());
  }
}
