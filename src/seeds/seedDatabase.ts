import { AppDataSource } from '../data-source';
import User  from '../entities/User.entity';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    const dataSource = await AppDataSource.initialize();

    console.log('Database connection established.');

    // Truncate all related tables with CASCADE
    await dataSource.query(`TRUNCATE TABLE "friend", "friend_request", "users" CASCADE`);

    // Hash password for sample users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Insert 10 sample users
    const sampleUsers = [
      { username: 'john_doe', password: hashedPassword, firstName: 'John', lastName: 'Doe', age: 30 },
      { username: 'jane_smith', password: hashedPassword, firstName: 'Jane', lastName: 'Smith', age: 28 },
      { username: 'alice_brown', password: hashedPassword, firstName: 'Alice', lastName: 'Brown', age: 35 },
      { username: 'robert_wilson', password: hashedPassword, firstName: 'Robert', lastName: 'Wilson', age: 40 },
      { username: 'emily_clark', password: hashedPassword, firstName: 'Emily', lastName: 'Clark', age: 25 },
      { username: 'david_johnson', password: hashedPassword, firstName: 'David', lastName: 'Johnson', age: 33 },
      { username: 'sarah_miller', password: hashedPassword, firstName: 'Sarah', lastName: 'Miller', age: 27 },
      { username: 'michael_brown', password: hashedPassword, firstName: 'Michael', lastName: 'Brown', age: 36 },
      { username: 'olivia_taylor', password: hashedPassword, firstName: 'Olivia', lastName: 'Taylor', age: 29 },
      { username: 'james_anderson', password: hashedPassword, firstName: 'James', lastName: 'Anderson', age: 32 },
    ];

    await dataSource.getRepository(User).save(sampleUsers);

    console.log('Seeding completed successfully!');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
};

seedDatabase();
