const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEFAULT_CONTENT = {
  id: 'global',
  aboutAdminNote:
    'Cette page A propos peut etre mise a jour depuis l espace Admin (contenu, chiffres et sections).',
  contactHeaderTitle: 'Contactez-nous',
  contactHeaderDescription:
    'Notre equipe est a votre disposition pour repondre a toutes vos questions et vous accompagner dans votre projet immobilier.',
  contactPhone: '+212 600 00 00 00',
  contactEmail: 'contact@idrissvilla.com',
  contactAddress: '123 Avenue Mohammed V, Tanger, Maroc',
  contactHours: 'Lun - Ven: 9h00 - 18h00',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  whatsappUrl: 'https://wa.me/212600000000',
};

async function ensureSiteContent() {
  return prisma.siteContent.upsert({
    where: { id: 'global' },
    update: {},
    create: DEFAULT_CONTENT,
  });
}

const getSiteContentPublic = async (req, res, next) => {
  try {
    const content = await ensureSiteContent();
    res.status(200).json({
      status: 'success',
      data: { content },
    });
  } catch (error) {
    next(error);
  }
};

const updateSiteContentAdmin = async (req, res, next) => {
  try {
    const allowedFields = [
      'aboutAdminNote',
      'contactHeaderTitle',
      'contactHeaderDescription',
      'contactPhone',
      'contactEmail',
      'contactAddress',
      'contactHours',
      'instagramUrl',
      'facebookUrl',
      'whatsappUrl',
    ];

    const payload = {};
    for (const key of allowedFields) {
      if (typeof req.body[key] === 'string') {
        payload[key] = req.body[key].trim();
      }
    }

    const content = await prisma.siteContent.upsert({
      where: { id: 'global' },
      create: { ...DEFAULT_CONTENT, ...payload },
      update: payload,
    });

    res.status(200).json({
      status: 'success',
      message: 'Contenu du site mis a jour avec succes',
      data: { content },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSiteContentPublic,
  updateSiteContentAdmin,
};
