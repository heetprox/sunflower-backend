import { config } from "../config/config";
import { prisma } from "./prisma";

async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query test passed');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
  }
}

// Accept the HTTP server instance
export async function runServer(server: any) {
  try {
    // Connect to database first
    const dbConnected = await connectDatabase();
    
    if (!dbConnected) {
      console.error("Failed to connect to the database");
      process.exit(1);
    }

    // Start the server
    server.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port} - http://localhost:${config.port}`);
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      await disconnectDatabase();
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      await disconnectDatabase();
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

export { prisma, connectDatabase, disconnectDatabase };