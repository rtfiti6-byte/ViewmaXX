import { PrismaClient } from '@prisma/client';
const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
};
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@viewmaxx.com' },
    update: {},
    create: {
      email: 'admin@viewmaxx.com',
      username: 'admin',
      displayName: 'ViewmaXX Admin',
      password: adminPassword,
      role: UserRole.ADMIN,
      isVerified: true,
      isEmailVerified: true,
      bio: 'ViewmaXX Platform Administrator',
    },
  });

  // Create demo users
  const users = [
    {
      email: 'creator1@example.com',
      username: 'techcreator',
      displayName: 'Tech Creator',
      bio: 'Creating amazing tech content!',
    },
    {
      email: 'creator2@example.com',
      username: 'musiclover',
      displayName: 'Music Lover',
      bio: 'Sharing the best music videos',
    },
    {
      email: 'creator3@example.com',
      username: 'gamingpro',
      displayName: 'Gaming Pro',
      bio: 'Professional gaming content',
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const password = await bcrypt.hash('password123', 12);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password,
        isEmailVerified: true,
      },
    });
    createdUsers.push(user);
  }

  // Create sample playlists
  for (const user of createdUsers) {
    await prisma.playlist.create({
      data: {
        title: 'My Favorites',
        description: 'Collection of my favorite videos',
        userId: user.id,
      },
    });

    await prisma.playlist.create({
      data: {
        title: 'Watch Later',
        description: 'Videos to watch later',
        userId: user.id,
      },
    });
  }

  // Create default settings
  const defaultSettings = [
    {
      key: 'SITE_NAME',
      value: 'ViewmaXX',
    },
    {
      key: 'SITE_DESCRIPTION',
      value: 'The ultimate video sharing platform',
    },
    {
      key: 'MAX_VIDEO_SIZE',
      value: 2147483648, // 2GB
    },
    {
      key: 'ALLOWED_VIDEO_FORMATS',
      value: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
    },
    {
      key: 'MONETIZATION_THRESHOLD_VIEWS',
      value: 50000,
    },
    {
      key: 'MONETIZATION_THRESHOLD_DAYS',
      value: 30,
    },
    {
      key: 'MONETIZATION_MIN_DURATION',
      value: 180, // 3 minutes
    },
    {
      key: 'CONTENT_MODERATION_ENABLED',
      value: true,
    },
    {
      key: 'AUTO_APPROVE_VIDEOS',
      value: true,
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('✅ Database seeding completed!');
  console.log(`👤 Admin user created: admin@viewmaxx.com (password: admin123)`);
  console.log(`👥 Demo users created: ${createdUsers.length}`);
  console.log(`⚙️  Default settings configured`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });