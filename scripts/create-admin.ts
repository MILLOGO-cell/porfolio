import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'nicolasmillogo3@gmail.com';
    const name = 'Ouettéré Nicolas MILLOGO';
    const password = 'Admin123!';

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ Utilisateur déjà existant avec cet email');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    console.log('✅ Utilisateur admin créé avec succès !');
    console.log('📧 Email:', user.email);
    console.log('👤 Nom:', user.name);
    console.log('🔑 Mot de passe:', password);
    console.log('\n⚠️  IMPORTANT: Changez le mot de passe après la première connexion !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();