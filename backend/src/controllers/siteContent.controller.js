const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEFAULT_CONTENT = {
  id: 'global',
  // About page
  aboutHeroTitle: 'Une agence immobiliere moderne, orientee resultat',
  aboutHeroDescription:
    'Idriss Villa Style combine expertise terrain, outils digitaux et accompagnement humain pour vous aider a vendre, acheter ou louer dans les meilleures conditions.',
  aboutAgencyDescription:
    'Fondee sur des valeurs de confiance et de transparence, notre agence place chaque client au centre de son action. Nous mettons notre connaissance du marche local au service de vos projets immobiliers, qu il s agisse d une premiere acquisition ou d un investissement strategique.',
  aboutAdminNote:
    'Cette page A propos peut etre mise a jour depuis l espace Admin (contenu, chiffres et sections).',
  aboutMetric1Value: '500+',
  aboutMetric1Label: 'Biens verifies',
  aboutMetric2Value: '1000+',
  aboutMetric2Label: 'Clients accompagnes',
  aboutMetric3Value: '10+',
  aboutMetric3Label: 'Annees d experience',
  aboutMetric4Value: '98%',
  aboutMetric4Label: 'Satisfaction client',
  // Contact page
  contactHeaderTitle: 'Contactez-nous',
  contactHeaderDescription:
    'Notre equipe est a votre disposition pour repondre a toutes vos questions et vous accompagner dans votre projet immobilier.',
  contactPhone: '+212 600 00 00 00',
  contactEmail: 'contact@idrissvilla.com',
  contactAddress: '123 Avenue Mohammed V, Tanger, Maroc',
  contactHours: 'Lun - Ven: 9h00 - 18h00',
  // Social
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
      'aboutHeroTitle',
      'aboutHeroDescription',
      'aboutAgencyDescription',
      'aboutAdminNote',
      'aboutMetric1Value',
      'aboutMetric1Label',
      'aboutMetric2Value',
      'aboutMetric2Label',
      'aboutMetric3Value',
      'aboutMetric3Label',
      'aboutMetric4Value',
      'aboutMetric4Label',
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
