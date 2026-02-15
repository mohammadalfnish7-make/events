import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@events.sa' },
        update: {},
        create: {
            email: 'admin@events.sa',
            password: hashedPassword,
            name: 'Admin',
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create sample services
    const services = [
        {
            titleEn: 'Wedding Planning',
            titleAr: 'تخطيط الأعراس',
            descriptionEn: 'Create your dream wedding with our expert planners. We handle everything from venue selection to the finest details, ensuring your special day is unforgettable.',
            descriptionAr: 'اصنع حفل زفاف أحلامك مع مخططينا الخبراء. نحن نتولى كل شيء من اختيار المكان إلى أدق التفاصيل، لضمان يوم لا يُنسى.',
            price: 15000,
            isActive: true,
            order: 1,
        },
        {
            titleEn: 'Corporate Events',
            titleAr: 'فعاليات الشركات',
            descriptionEn: 'Professional corporate event planning for conferences, product launches, team building activities, and company celebrations.',
            descriptionAr: 'تخطيط فعاليات الشركات المهنية للمؤتمرات وإطلاق المنتجات وأنشطة بناء الفريق واحتفالات الشركات.',
            price: 25000,
            isActive: true,
            order: 2,
        },
        {
            titleEn: 'Private Parties',
            titleAr: 'الحفلات الخاصة',
            descriptionEn: 'Celebrate birthdays, anniversaries, and special moments with style. Custom themes and personalized experiences for all ages.',
            descriptionAr: 'احتفل بأعياد الميلاد والذكرى السنوية واللحظات الخاصة بأسلوب مميز. ثيمات مخصصة وتجارب شخصية لجميع الأعمار.',
            price: 5000,
            isActive: true,
            order: 3,
        },
        {
            titleEn: 'Event Decoration',
            titleAr: 'تزيين الفعاليات',
            descriptionEn: 'Transform any venue into a stunning space with our creative decoration services. From elegant to extravagant designs.',
            descriptionAr: 'حول أي مكان إلى مساحة مذهلة مع خدمات الديكور الإبداعية لدينا. من التصاميم الأنيقة إلى الفاخرة.',
            price: 8000,
            isActive: true,
            order: 4,
        },
    ];

    for (const service of services) {
        const id = service.titleEn.replace(/\s+/g, '-').toLowerCase();
        await prisma.service.upsert({
            where: { id },
            update: service,
            create: {
                ...service,
                id,
            },
        });
    }
    console.log('✅ Sample services created');

    console.log('🎉 Database seed completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
 