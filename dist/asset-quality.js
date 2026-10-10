(function(root){
  'use strict';
  const Physical=typeof module==='object'&&module.exports?require('./physical-metadata.js'):root.DTSPhysicalMetadata;
  const SOURCE_STATUS=new Set(['verified','declared','unverified','missing']);
  const SOURCE_AUTHORITY=new Set(['manufacturer','official-doc','authorized-distributor','supplier','other']);
  const ORIENTATION=new Set(['orthographic-front','front-perspective','perspective','side','rear','unverified']);
  const MATCH=new Set(['exact','family','representative','unverified']);
  const PROVENANCE_STATUS=new Set(['recorded','partial','unknown']);
  const LICENSE_STATUS=new Set(['unknown','verified','restricted','permitted']);

  const manufacturerDomains=[
    'siemens.com','weidmueller.com','rittal.com','sick.com','autonics.com',
    'omron.eu','omron.co.jp','ia.omron.com','omron-ap.com','se.com',
    'mitsubishielectric.com','abb.com','rockwellautomation.com','deltaww.com','deltavina.com'
  ];
  const supplierDomains=[
    'santaclarasystems.com','gmtcontrol.com','em.co.za','plc-direct.com','ima-tec.com',
    'plcdepartment.com','iqelectro.com','rs-online.com','tremtech.com','gumruksepeti.com'
  ];
  const sidecarVisualSources=Object.freeze({
    'sinamics-v20-book':Object.freeze({
      file:'assets/products/sinamics-v20-6sl3210-5bb21-5uv1-user-front-v2.webp',
      imageSource:'user-upload:Siemens SINAMICS V20 Ön Paneli(1).png',
      source:'https://www.gumruksepeti.com/products/siemens-sinamics-v20-6sl3210-5bb21-5uv1-1-5kw-surucu-2-el',
      retrievedAt:'2026-10-06',
      provenanceEvidence:'user source SHA256 c4ee3a380e2f929248936e6c8eb8ec864dc4cbd83b0ab8686a47cc4f462125c3; calibrated repo WebP SHA256 4b2b8eb69d2f031d05631fc8dcc05bcd270aaa5246a1263df0711acbd0fe3b12; Git blob b5ec6f07b604f35d659788267b734e4e11e79fd7; exact product identity independently verified by Siemens CAD/DXF and prior Gümrük Sepeti same-gallery nameplate evidence',
      license:'user-supplied',
      licenseStatus:'permitted',
      usageRights:'project-use-authorized-by-user',
      attributionRequired:'no'
    }),
    'siemens-mcb1-v113':Object.freeze({
      imageSource:'https://www.automation.siemens.com/bilddb/cax_en.aspx?mlfb=5SL6116-7',
      retrievedAt:'2026-10-05',
      provenanceEvidence:'embedded-xmp: Siemens AG - Industry Sector; xmpRights WebStatement automation.siemens.com/bilddb',
      license:'© Siemens AG 2010, Alle Rechte vorbehalten',
      licenseStatus:'restricted',
      licenseSourceUrl:'https://www.automation.siemens.com/bilddb/cax_en.aspx?mlfb=5SL6116-7',
      usageRights:'manufacturer-rights-reserved',
      attributionRequired:'unknown',
      attributionText:'© Siemens AG 2010, Alle Rechte vorbehalten'
    }),
    'siemens-mcb2-v113':Object.freeze({
      imageSource:'https://www.automation.siemens.com/bilddb/cax_en.aspx?mlfb=5SL6216-7',
      retrievedAt:'2026-10-05',
      provenanceEvidence:'embedded-xmp: Siemens AG - Industry Sector; xmpRights WebStatement automation.siemens.com/bilddb',
      license:'© Siemens AG 2010, Alle Rechte vorbehalten',
      licenseStatus:'restricted',
      licenseSourceUrl:'https://www.automation.siemens.com/bilddb/cax_en.aspx?mlfb=5SL6216-7',
      usageRights:'manufacturer-rights-reserved',
      attributionRequired:'unknown',
      attributionText:'© Siemens AG 2010, Alle Rechte vorbehalten'
    }),
    'siemens-mcb3-v113':Object.freeze({
      imageSource:'https://www.automation.siemens.com/bilddb/cax_en.aspx?mlfb=5SL6316-7',
      retrievedAt:'2026-10-05',
      provenanceEvidence:'embedded-xmp: Siemens AG - Industry Sector; xmpRights WebStatement automation.siemens.com/bilddb',
      license:'© Siemens AG 2010, Alle Rechte vorbehalten',
      licenseStatus:'restricted',
      licenseSourceUrl:'https://www.automation.siemens.com/bilddb/cax_en.aspx?mlfb=5SL6316-7',
      usageRights:'manufacturer-rights-reserved',
      attributionRequired:'unknown',
      attributionText:'© Siemens AG 2010, Alle Rechte vorbehalten'
    })
  });

  const orientationAudit=Object.freeze({
    'weidmuller-pro-top':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-04'}),
    'autonics-pr':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-04'}),
    'autonics-bj':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-04'}),
    'rittal-fan':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-04'}),
    'siemens-green-button':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-04'}),
    'siemens-contactor':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-04'}),
    'siemens-auxiliary':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-04'}),
    'sick-photoelectric':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-04'}),
    'sinamics-v20-book':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'siemens-mcb1-v113':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-04'}),
    'siemens-mcb2-v113':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'siemens-mcb3-v113':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'siemens-isolator-v113':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-04'}),
    'siemens-thermal-v113':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-04'}),
    'product-plc-0-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-10':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-11':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-12':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-13':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-14':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-15':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-16':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-17':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-18':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-19':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-0-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-10':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-11':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-12':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-13':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-14':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-15':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-1-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-10':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-11':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-12':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-13':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-14':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-10-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-11-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-11-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-11-10':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-11-11':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-11-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-11-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-11-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-11-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-11-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-11-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-11-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-11-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-10':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-11':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-12':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-13':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-4':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-5':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-6':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-12-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-10':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-11':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-12':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-13':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-13-14':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-10':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-11':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-12':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-13':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-14':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-15':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-16':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-17':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-18':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-19':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-20':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-21':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-22':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-14-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-10':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-11':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-12':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-13':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-14':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-2-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-3-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-3-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-3-10':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-3-11':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-3-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-3-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-3-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-3-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-3-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-3-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-3-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-3-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-4-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-4-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-4-11':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-4-12':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-4-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-4-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-4-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-4-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-4-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-4-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-4-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-5-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-5-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-5-10':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-5-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-5-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-5-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-5-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-5-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-5-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-5-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-6-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-6-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-6-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-6-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-6-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-6-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-6-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-7-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-7-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-7-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-7-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-7-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-7-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-7-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-7-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-7-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-7-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-8-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-8-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-8-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-8-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-8-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-8-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-8-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-8-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-8-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-8-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-9-0':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-9-1':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-9-10':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-9-11':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-9-2':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-9-3':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-9-4':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-9-5':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-9-6':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-9-7':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-9-8':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'product-plc-9-9':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'single-pole-breaker':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'three-pole-breaker':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'two-pole-rcd':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'power-contactor':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'green-pushbutton':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'red-pushbutton':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'emergency-stop':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'rotary-selector':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'limit-switch':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'cube-relay':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'din-timer':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'auxiliary-contact':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'transformer':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'din-power-supply':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'incandescent-bulb-off':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'incandescent-bulb-on':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'induction-motor':Object.freeze({status:'side',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'solenoid-valve':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'proximity-sensor':Object.freeze({status:'side',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'photoelectric-sensor':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'beacon-buzzer':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'fuse-carrier':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'terminal-block':Object.freeze({status:'side',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'earth-terminal':Object.freeze({status:'side',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'distribution-bus':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'panel-meter':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'power-resistor':Object.freeze({status:'side',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'capacitor':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'power-diode':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'vfd':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'plc-cpu':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'plc-io':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'mains-terminal':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'three-phase-terminal':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'blue-pushbutton':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'float-switch':Object.freeze({status:'side',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'pressure-switch':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'thermal-overload':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'motor-protection':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'changeover-contact':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'bridge-rectifier':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'green-led-off':Object.freeze({status:'perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'reactor':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'current-transformer':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'generator':Object.freeze({status:'side',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'plc-communication':Object.freeze({status:'front-perspective',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'electronic-enclosure':Object.freeze({status:'orthographic-front',evidence:'pixel-audit',auditedAt:'2026-10-05'}),
    'terminal-screw':Object.freeze({status:'unverified',evidence:'pixel-audit',auditedAt:'2026-10-05'})
  });
  const host=url=>{const m=String(url||'').match(/^https?:\/\/([^/:?#]+)/i);return m?m[1].toLowerCase().replace(/^www\./,''):''};
  const domainMatch=(h,list)=>list.some(d=>h===d||h.endsWith('.'+d));
  function authority(url){
    const h=host(url);if(!h)return'other';
    if(domainMatch(h,manufacturerDomains))return'manufacturer';
    if(domainMatch(h,supplierDomains))return'supplier';
    return'other';
  }
  const sourceStatus=url=>/^(?:https?:\/\/|user-upload:)/i.test(String(url||''))?'declared':'missing';

  function mappingForAsset(assetKey){
    const entries=Object.entries(Physical?.componentMap||{}).filter(([,m])=>m?.assetKey===assetKey);
    if(!entries.length)return null;
    const products=[...new Set(entries.map(([,m])=>m.productKey).filter(Boolean))];
    if(products.length!==1)return {componentIds:entries.map(([id])=>id),productKey:null,mapping:entries[0][1],ambiguous:true};
    return {componentIds:entries.map(([id])=>id),productKey:products[0],mapping:entries[0][1],ambiguous:false};
  }
  function technicalSource(assetKey){
    const link=mappingForAsset(assetKey);if(!link||link.ambiguous||!link.productKey)return null;
    const p=Physical?.products?.[link.productKey];if(!p||!/^https:\/\//.test(String(p.sourceUrl||'')))return null;
    return {
      productKey:p.productKey,
      manufacturer:p.manufacturer,
      model:p.model,
      url:p.sourceUrl,
      status:p.sourceStatus||'unverified',
      authority:p.sourceAuthority||'other',
      sourceType:p.sourceType||'unknown',
      retrievedAt:p.retrievedAt||null,
      componentIds:link.componentIds
    };
  }
  function descriptor(assetKey,record={},manifest='unknown'){
    const link=mappingForAsset(assetKey),mapping=link?.mapping||null,sidecar=sidecarVisualSources[assetKey]||{};
    const visualSourceUrl=record.imageSource||record.source||sidecar.imageSource||sidecar.source||null,catalogSourceUrl=record.source||sidecar.source||null;
    const audited=orientationAudit[assetKey]||null,orientationStatus=audited?.status||mapping?.visualOrientationStatus||'unverified';
    const retrievedAt=(typeof record.retrievedAt==='string'&&record.retrievedAt.trim()?record.retrievedAt:null)||(typeof sidecar.retrievedAt==='string'&&sidecar.retrievedAt.trim()?sidecar.retrievedAt:null);
    return {
      assetKey,
      manifest,
      file:record.file||sidecar.file||null,
      brand:record.brand||null,
      model:record.model||null,
      part:record.part||null,
      matchQuality:MATCH.has(record.match)?record.match:MATCH.has(mapping?.visualMatchStatus)?mapping.visualMatchStatus:'unverified',
      orientationStatus:ORIENTATION.has(orientationStatus)?orientationStatus:'unverified',
      orientationAuditStatus:audited?'verified':orientationStatus==='unverified'?'unverified':'declared',
      orientationEvidence:audited?.evidence||null,
      orientationAuditedAt:audited?.auditedAt||null,
      visualSourceUrl,
      sourceStatus:sourceStatus(visualSourceUrl),
      sourceAuthority:authority(visualSourceUrl),
      catalogSourceUrl,
      catalogSourceAuthority:authority(catalogSourceUrl),
      technicalSource:technicalSource(assetKey),
      technicalSourceStatus:technicalSource(assetKey)?.status||'missing',
      provenanceStatus:visualSourceUrl?(retrievedAt?'recorded':'partial'):'unknown',
      provenanceEvidence:typeof record.provenanceEvidence==='string'&&record.provenanceEvidence.trim()?record.provenanceEvidence:(typeof sidecar.provenanceEvidence==='string'&&sidecar.provenanceEvidence.trim()?sidecar.provenanceEvidence:null),
      retrievedAt,
      license:typeof record.license==='string'&&record.license.trim()?record.license:(typeof sidecar.license==='string'&&sidecar.license.trim()?sidecar.license:'unknown'),
      licenseStatus:LICENSE_STATUS.has(record.licenseStatus)?record.licenseStatus:(LICENSE_STATUS.has(sidecar.licenseStatus)?sidecar.licenseStatus:'unknown'),
      licenseSourceUrl:/^https?:\/\//i.test(String(record.licenseSourceUrl||''))?record.licenseSourceUrl:(/^https?:\/\//i.test(String(sidecar.licenseSourceUrl||''))?sidecar.licenseSourceUrl:null),
      usageRights:typeof record.usageRights==='string'&&record.usageRights.trim()?record.usageRights:(typeof sidecar.usageRights==='string'&&sidecar.usageRights.trim()?sidecar.usageRights:'unknown'),
      attributionRequired:typeof record.attributionRequired==='boolean'?record.attributionRequired:(typeof sidecar.attributionRequired==='boolean'?sidecar.attributionRequired:'unknown'),
      attributionText:typeof record.attributionText==='string'&&record.attributionText.trim()?record.attributionText:(typeof sidecar.attributionText==='string'&&sidecar.attributionText.trim()?sidecar.attributionText:null)
    };
  }
  function validate(d){
    if(!d||typeof d!=='object')return {ok:false,reason:'descriptor'};
    if(typeof d.assetKey!=='string'||!d.assetKey)return {ok:false,reason:'assetKey'};
    if(!MATCH.has(d.matchQuality))return {ok:false,reason:'matchQuality'};
    if(!ORIENTATION.has(d.orientationStatus))return {ok:false,reason:'orientationStatus'};
    if(!SOURCE_STATUS.has(d.sourceStatus))return {ok:false,reason:'sourceStatus'};
    if(!SOURCE_AUTHORITY.has(d.sourceAuthority)||!SOURCE_AUTHORITY.has(d.catalogSourceAuthority))return {ok:false,reason:'sourceAuthority'};
    if(d.sourceStatus==='missing'&&d.visualSourceUrl!==null)return {ok:false,reason:'missingVisualSource'};
    if(d.sourceStatus!=='missing'&&!/^(?:https?:\/\/|user-upload:)/i.test(String(d.visualSourceUrl||'')))return {ok:false,reason:'visualSourceUrl'};
    if(d.technicalSource!==null){
      if(!SOURCE_STATUS.has(d.technicalSource.status)||!SOURCE_AUTHORITY.has(d.technicalSource.authority))return {ok:false,reason:'technicalSource'};
      if(!/^https:\/\//.test(String(d.technicalSource.url||'')))return {ok:false,reason:'technicalSourceUrl'};
    }
    if(!PROVENANCE_STATUS.has(d.provenanceStatus))return {ok:false,reason:'provenanceStatus'};
    if(d.retrievedAt!==null&&typeof d.retrievedAt!=='string')return {ok:false,reason:'retrievedAt'};
    if(typeof d.license!=='string'||!d.license)return {ok:false,reason:'license'};
    if(!LICENSE_STATUS.has(d.licenseStatus))return {ok:false,reason:'licenseStatus'};
    if(d.licenseSourceUrl!==null&&!/^https?:\/\//i.test(String(d.licenseSourceUrl||'')))return {ok:false,reason:'licenseSourceUrl'};
    if(typeof d.usageRights!=='string'||!d.usageRights)return {ok:false,reason:'usageRights'};
    if(!(typeof d.attributionRequired==='boolean'||d.attributionRequired==='unknown'))return {ok:false,reason:'attributionRequired'};
    if(d.attributionText!==null&&typeof d.attributionText!=='string')return {ok:false,reason:'attributionText'};
    return {ok:true};
  }
  function promotionVisual(assetKey,record={},manifest='unknown'){
    const d=descriptor(assetKey,record,manifest),reasons=[];
    if(d.matchQuality!=='exact')reasons.push('exact-product-visual');
    if(d.orientationStatus!=='orthographic-front')reasons.push('orthographic-front');
    if(d.orientationAuditStatus!=='verified')reasons.push('pixel-audited-orientation');
    if(d.sourceStatus==='missing'||(!/^https?:\/\//i.test(String(d.visualSourceUrl||''))&&!/^user-upload:/i.test(String(d.visualSourceUrl||''))))reasons.push('external-visual-source');
    if(d.provenanceStatus==='unknown')reasons.push('recorded-visual-provenance');
    return {ready:reasons.length===0,reasons,descriptor:d};
  }

  function describeManifest(manifest,name='unknown'){
    return Object.fromEntries(Object.entries(manifest||{}).map(([key,record])=>[key,descriptor(key,record,name)]));
  }
  function audit(manifest,name='unknown'){
    const records=describeManifest(manifest,name),values=Object.values(records),invalid=values.map(d=>[d,validate(d)]).filter(([,v])=>!v.ok);
    const count=field=>values.reduce((m,d)=>(m[d[field]]=(m[d[field]]||0)+1,m),{});
    return {name,total:values.length,invalid:invalid.map(([d,v])=>({assetKey:d.assetKey,reason:v.reason})),sourceStatus:count('sourceStatus'),sourceAuthority:count('sourceAuthority'),orientationStatus:count('orientationStatus'),matchQuality:count('matchQuality'),provenanceStatus:count('provenanceStatus'),technicalSources:values.filter(d=>d.technicalSource).length,licenseUnknown:values.filter(d=>d.licenseStatus==='unknown').length,usageRightsUnknown:values.filter(d=>d.usageRights==='unknown').length,attributionUnknown:values.filter(d=>d.attributionRequired==='unknown').length,retrievedAtMissing:values.filter(d=>d.retrievedAt===null).length};
  }
  const api={descriptor,promotionVisual,describeManifest,audit,validate,authority,technicalSource,mappingForAsset,orientationAudit,sidecarVisualSources,constants:{SOURCE_STATUS:[...SOURCE_STATUS],SOURCE_AUTHORITY:[...SOURCE_AUTHORITY],ORIENTATION:[...ORIENTATION],MATCH:[...MATCH],PROVENANCE_STATUS:[...PROVENANCE_STATUS],LICENSE_STATUS:[...LICENSE_STATUS]}};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSAssetQuality=api;
})(typeof window==='undefined'?globalThis:window);
