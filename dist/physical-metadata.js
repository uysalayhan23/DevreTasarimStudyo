(function(root){
  'use strict';

  const VALID_STATUS=new Set(['verified','partial','unverified','approximate']);
  const VALID_AUTHORITY=new Set(['manufacturer','official-doc','authorized-distributor','supplier','other']);
  const VALID_VISUAL_MATCH=new Set(['exact','family','representative','unverified']);
  const VALID_VISUAL_ORIENTATION=new Set(['orthographic-front','source-image-derived-front','front-lens','isometric','three-quarter','isometric-allowed','front-perspective','perspective','side','rear','unverified']);
  const VALID_TERMINAL_STATUS=new Set(['verified','unverified','connectorized-external']);
  const VALID_TERMINAL_IDENTITY_STATUS=new Set(['verified','partial','unverified']);
  const VALID_PROFILE_STATUS=new Set(['verified','unverified']);
  const VALID_COLLIDER_STATUS=new Set(['verified-profile','conservative-envelope']);
  const VALID_ASSET_IDENTITY_FIELDS=new Set(['materialAsset','siemensPhoto','instrument']);

  const products=Object.freeze({
    'ordel-hmt-head-transmitter':Object.freeze({
      productKey:'ordel-hmt-head-transmitter',
      manufacturer:'ORDEL',
      model:'HMT-R / HMT-T kafa tipi sıcaklık sinyal dönüştürücü',
      widthMm:45,
      heightMm:45,
      depthMm:20,
      sourceStatus:'verified',
      sourceAuthority:'manufacturer',
      sourceType:'manufacturer-manual',
      sourceUrl:'https://www.ordel.com.tr/upload/KK_134_3_TR_HMT-R.pdf',
      retrievedAt:'2026-10-07',
      mountingType:'sensor-head',
      allowedPanelMounts:['external'],
      defaultPanelMount:'external',
      panelGeometryReady:false
    }),
    'weidmuller-8540300000':Object.freeze({
      productKey:'weidmuller-8540300000',
      manufacturer:'Weidmüller',
      model:'WAZ5 VCC 0-10V/4-20MA · 8540300000',
      widthMm:17.5,
      heightMm:92.4,
      depthMm:112.4,
      sourceStatus:'verified',
      sourceAuthority:'manufacturer',
      sourceType:'datasheet',
      sourceUrl:'https://datasheet.weidmueller.com/pdf/en/8540300000/scope/1/',
      retrievedAt:'2026-10-07',
      mountingType:'din-rail',
      allowedPanelMounts:['rail'],
      defaultPanelMount:'rail',
      panelGeometryReady:false
    }),
    'siemens-3rt2016-1bb41':Object.freeze({
      productKey:'siemens-3rt2016-1bb41',
      manufacturer:'Siemens',
      model:'SIRIUS 3RT2016-1BB41',
      widthMm:45,
      heightMm:58,
      depthMm:73,
      requiredClearanceMm:Object.freeze({
        sideBySide:Object.freeze({forward:10,up:10,down:10,side:0}),
        groundedParts:Object.freeze({forward:10,up:10,down:10,side:6}),
        liveParts:Object.freeze({forward:10,up:10,down:10,side:6})
      }),
      sourceStatus:'verified',
      sourceAuthority:'manufacturer',
      sourceType:'datasheet',
      sourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=3RT2016-1BB41',
      retrievedAt:'2026-10-04',
      mountingType:'din-rail',
      allowedPanelMounts:['rail'],
      defaultPanelMount:'rail',
      panelGeometryReady:true
    }),
    'weidmuller-2466870000':Object.freeze({
      productKey:'weidmuller-2466870000',
      manufacturer:'Weidmüller',
      model:'PRO TOP1 120W 24V 5A · 2466870000',
      widthMm:35,
      heightMm:130,
      depthMm:125,
      requiredClearanceMm:Object.freeze({
        freeAirFlow:Object.freeze({up:50,down:50}),
        neighbouringSubassemblies:Object.freeze({side:10})
      }),
      sourceStatus:'verified',
      sourceAuthority:'manufacturer',
      sourceType:'datasheet',
      sourceUrl:'https://datasheet.weidmueller.com/pdf/en/2466870000/scope/1/',
      retrievedAt:'2026-10-04',
      mountingType:'din-rail',
      profileStatus:'verified',
      profileMethod:'exact-article-top-dxf-main-body-silhouette+nominal-frame-normalization',
      profileSourceUrl:'https://eshop.weidmueller.com/en/pro-top1-120w-24v-5a/p/2466870000/downloads',
      profileBoundsMm:Object.freeze({width:35,height:130,depth:125}),
      profileEvidenceFiles:Object.freeze([
        Object.freeze({file:'2466870000_DXF.zip',sha256:'e248de04fa18ab287e5bc3b1fb5ebd07e5e6de768af32ab30dff46aeae8f2f48',role:'exact-article-six-view-dxf'}),
        Object.freeze({file:'2466870000_top.DXF',sha256:'183feb0ba2dcc7e3adb3435035c586ebbc62e33c38dfcdc1e66f6c30baaa9a54',role:'exact-article-top-profile'})
      ]),
      profileEvidence:Object.freeze({
        topCadRawMainBodyMm:Object.freeze({width:34,depth:124.9}),
        topCadReferenceDepthMm:Object.freeze({rear:10.5,front:135.4}),
        normalization:Object.freeze({widthScale:35/34,depthScale:125/124.9}),
        evidenceRecord:'evidence/selection2/weidmuller-2466870000-dxf-terminal-evidence.json'
      }),
      colliderStatus:'verified-profile',
      colliderMethod:'exact-cad-top-view-convex-profile',
      colliderProfileXZMm:Object.freeze([
        Object.freeze({x:0,z:0}),
        Object.freeze({x:35,z:0}),
        Object.freeze({x:35,z:125}),
        Object.freeze({x:0,z:125})
      ]),
      colliderDecision:'exact 2466870000 top-view DXF main-body silhouette is consumed by runtime collision as a normalized convex profile; terminal/contact protrusions outside the main body remain covered by the separate verified terminal geometry and manufacturer clearance rules',
      allowedPanelMounts:['rail'],
      defaultPanelMount:'rail',
      panelGeometryReady:true
    }),
    'rittal-3241100':Object.freeze({
      productKey:'rittal-3241100',
      manufacturer:'Rittal',
      model:'TopTherm 3241100',
      widthMm:255,
      heightMm:255,
      depthMm:107,
      projectionDepthMm:25,
      mountingCutoutWidthMm:224,
      mountingCutoutHeightMm:224,
      sourceStatus:'verified',
      sourceAuthority:'manufacturer',
      sourceType:'product-page',
      sourceUrl:'https://www.rittal.com/us-en_US/products/PG20231215KLI101/PG20231215KLI102/PG20240718KLI001/PRO0299?variantId=3241100',
      retrievedAt:'2026-10-04',
      depthMeaning:'installation-depth',
      mountingType:'door-cutout',
      profileStatus:'unverified',
      allowedPanelMounts:['door'],
      defaultPanelMount:'door',
      panelGeometryReady:true
    }),
    'siemens-6sl3210-5bb21-5uv1':Object.freeze({
      productKey:'siemens-6sl3210-5bb21-5uv1',
      manufacturer:'Siemens',
      model:'SINAMICS V20 6SL3210-5BB21-5UV1',
      widthMm:90.8,
      heightMm:160.9,
      depthMm:147,
      frameSize:'FSAC',
      profileStatus:'verified',
      profileMethod:'exact-article-dxf-multiview+embedded-u3d',
      profileSourceUrl:'https://mall.industry.siemens.com/mall/at/DE/Catalog/Product/?mlfb=6SL3210-5BB21-5UV1',
      profileBoundsMm:Object.freeze({width:90.8,height:160.9,depth:147}),
      profileEvidenceFiles:Object.freeze([
        Object.freeze({file:'6SL3210-5BB21-5UV1_2D_dimension_withFrame_en.DXF',sha256:'323f43f81033c746e1b19740387cd3518e0c77478eecb422e2fbbc2324f91bfd',role:'exact-article-2d-multiview'}),
        Object.freeze({file:'6SL3210-5BB21-5UV1_3D_en.pdf',sha256:'edefd2605c6e4e8367e834922f3ab0bee7abbcc48f1e7f3b38462d11640bc778',role:'exact-article-embedded-u3d'})
      ]),
      profileEvidence:Object.freeze({
        dxfFrontLayer:'10000_FRONT',dxfRightLayer:'12000_RIGHT',dxfBackLayer:'15000_BACK',
        frontDimensionMm:Object.freeze({width:90.8,height:160.9}),rightDepthDimensionMm:147,
        rightRawExtentMm:Object.freeze({depth:147.009998,height:161.322435}),
        embedded3dSubtype:'U3D',embedded3dDecodedBytes:917548,
        embedded3dStreamSha256:'d3915b3bbe9f4bc48724cf66f8770afbb16b1a555c6c6047431b1c5808d9a60c',
        embedded3dViews:Object.freeze(['Top','Front','Right','Bottom','Back','Left','Isometric'])
      }),
      colliderStatus:'conservative-envelope',
      colliderDecision:'exact profile evidence is verified, but current runtime door-sweep collision still consumes a rectangular W/H/depth envelope rather than the DXF/U3D profile; do not claim verified-profile collider until CAD profile geometry is integrated',
      requiredClearanceMm:Object.freeze({
        freeAirFlow:Object.freeze({up:100,down:100}),
        adjacentConverters:Object.freeze({side:0}),
        cabinetEnclosure:Object.freeze({side:15})
      }),
      sourceStatus:'verified',
      sourceAuthority:'manufacturer',
      sourceType:'datasheet',
      sourceUrl:'https://mall.industry.siemens.com/mall/at/DE/Catalog/Product/?mlfb=6SL3210-5BB21-5UV1',
      retrievedAt:'2026-10-04',
      mountingType:'mounting-plate',
      allowedPanelMounts:['plate'],
      defaultPanelMount:'plate',
      panelGeometryReady:true
    }),
    'sick-wtb4-3p2161':Object.freeze({
      productKey:'sick-wtb4-3p2161',
      manufacturer:'SICK',
      model:'WTB4-3P2161',
      widthMm:16,
      heightMm:39.5,
      depthMm:12,
      sourceStatus:'verified',
      sourceAuthority:'manufacturer',
      sourceType:'datasheet',
      sourceUrl:'https://www.sick.com/media/pdf/6/76/976/dataSheet_WTB4-3P2161_1028099_en.pdf',
      retrievedAt:'2026-10-04',
      mountingType:'field-device',
      allowedPanelMounts:['external'],
      defaultPanelMount:'external',
      panelGeometryReady:true
    }),
    'siemens-5sl6116-7':Object.freeze({
      productKey:'siemens-5sl6116-7',
      manufacturer:'Siemens',
      model:'SENTRON 5SL6116-7',
      widthMm:18,
      heightMm:90,
      depthMm:76,
      installationDepthMm:70,
      sourceStatus:'verified',
      sourceAuthority:'manufacturer',
      sourceType:'datasheet',
      sourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=5SL61167',
      retrievedAt:'2026-10-04',
      mountingType:'din-rail',
      allowedPanelMounts:['rail'],
      defaultPanelMount:'rail',
      panelGeometryReady:true
    }),
    'siemens-5sl6316-7':Object.freeze({
      productKey:'siemens-5sl6316-7',
      manufacturer:'Siemens',
      model:'SENTRON 5SL6316-7',
      widthMm:54,
      heightMm:90,
      depthMm:76,
      installationDepthMm:70,
      sourceStatus:'verified',
      sourceAuthority:'manufacturer',
      sourceType:'datasheet',
      sourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=5SL6316-7',
      retrievedAt:'2026-10-04',
      mountingType:'din-rail',
      allowedPanelMounts:['rail'],
      defaultPanelMount:'rail',
      panelGeometryReady:true
    }),
    'siemens-5sl6216-7':Object.freeze({
      productKey:'siemens-5sl6216-7',
      manufacturer:'Siemens',
      model:'SENTRON 5SL6216-7',
      widthMm:36,
      heightMm:90,
      depthMm:76,
      installationDepthMm:70,
      sourceStatus:'verified',
      sourceAuthority:'manufacturer',
      sourceType:'datasheet',
      sourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=5SL6216-7',
      retrievedAt:'2026-10-04',
      mountingType:'din-rail',
      allowedPanelMounts:['rail'],
      defaultPanelMount:'rail',
      panelGeometryReady:true
    }),
    'siemens-5tl1163-0':Object.freeze({
      productKey:'siemens-5tl1163-0',
      manufacturer:'Siemens',
      model:'SENTRON 5TL1163-0',
      widthMm:18,
      heightMm:89.8,
      depthMm:74.5,
      installationDepthMm:70,
      sourceStatus:'verified',
      sourceAuthority:'manufacturer',
      sourceType:'official-doc',
      sourceUrl:'https://cache.industry.siemens.com/dl/files/361/45315361/att_1100838/v1/MAN_L1V30855940002-01_en_en-US.pdf',
      retrievedAt:'2026-10-04',
      mountingType:'din-rail',
      allowedPanelMounts:['rail'],
      defaultPanelMount:'rail',
      panelGeometryReady:true
    }),
    'siemens-3rv2011-1ja10':Object.freeze({
      productKey:'siemens-3rv2011-1ja10',
      manufacturer:'Siemens',
      model:'SIRIUS 3RV2011-1JA10',
      widthMm:45,
      heightMm:97,
      depthMm:97,
      requiredClearanceMm:Object.freeze({
        sideBySide:Object.freeze({side:0})
      }),
      requiredClearanceByVoltageMm:Object.freeze({
        '400':Object.freeze({
          groundedParts:Object.freeze({up:30,down:30,side:9}),
          liveParts:Object.freeze({up:30,down:30,side:9})
        }),
        '500':Object.freeze({
          groundedParts:Object.freeze({up:30,down:30,side:9}),
          liveParts:Object.freeze({up:30,down:30,side:9})
        }),
        '690':Object.freeze({
          groundedParts:Object.freeze({up:50,down:50,forward:0,backward:0,side:30}),
          liveParts:Object.freeze({up:50,down:50,forward:0,backward:0,side:30})
        })
      }),
      sourceStatus:'verified',
      sourceAuthority:'manufacturer',
      sourceType:'datasheet',
      sourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=3RV2011-1JA10',
      retrievedAt:'2026-10-04',
      mountingType:'din-rail',
      profileStatus:'verified',
      profileMethod:'exact-article-dxf-front+left-dimensional-profile',
      profileSourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=3RV2011-1JA10',
      profileBoundsMm:Object.freeze({width:45,height:97,depth:96.9}),
      profileEvidenceFiles:Object.freeze([
        Object.freeze({file:'G_NSA0_XX_93051V.dxf',sha256:'1a498a463cf58d2406ef86cbe1f3b2dc6f0301312344c35498336f57db8178b3',role:'exact-article-front+left-dimensional-dxf'})
      ]),
      profileEvidence:Object.freeze({
        frontLayer:'10000_FRONT',leftLayer:'11000_LEFT',
        frontRawBoundsMm:Object.freeze({width:45,height:97}),
        leftRawBoundsMm:Object.freeze({depth:96.9,height:97}),
        frontDimensions:Object.freeze({width:45,height:97}),
        leftDimensions:Object.freeze({depth:96.9,referenceHeight:49,mountingOffset:5})
      }),
      colliderStatus:'conservative-envelope',
      colliderDecision:'exact front+left DXF verifies the physical profile bounds, but no exact top-view X/Z collision polygon is present in this evidence package; keep conservative-envelope until top/profile polygon geometry is supplied and consumed',
      allowedPanelMounts:['rail'],
      defaultPanelMount:'rail',
      panelGeometryReady:true
    })
  });

  // Product terminal identity is independent from schematic symbol decomposition.
  // fallbackX/fallbackY are legacy panel-display coordinates only; they are NOT verified mm anchors.
  const siemens3rt2016PanelTerminals=Object.freeze([
    Object.freeze({id:'1',label:'1/L1',fallbackX:30,fallbackY:0,fallbackSide:'top',sourceComponentId:'main-contact',sourcePinId:'1'}),
    Object.freeze({id:'3',label:'3/L2',fallbackX:60,fallbackY:0,fallbackSide:'top',sourceComponentId:'main-contact',sourcePinId:'3'}),
    Object.freeze({id:'5',label:'5/L3',fallbackX:90,fallbackY:0,fallbackSide:'top',sourceComponentId:'main-contact',sourcePinId:'5'}),
    Object.freeze({id:'13',label:'13NO',fallbackX:105,fallbackY:0,fallbackSide:'top',sourceComponentId:null,sourcePinId:null}),
    Object.freeze({id:'A1',label:'A1+',fallbackX:120,fallbackY:20,fallbackSide:'right',sourceComponentId:'coil-contactor',sourcePinId:'A1'}),
    Object.freeze({id:'2',label:'2/T1',fallbackX:30,fallbackY:106,fallbackSide:'bottom',sourceComponentId:'main-contact',sourcePinId:'2'}),
    Object.freeze({id:'4',label:'4/T2',fallbackX:60,fallbackY:106,fallbackSide:'bottom',sourceComponentId:'main-contact',sourcePinId:'4'}),
    Object.freeze({id:'6',label:'6/T3',fallbackX:90,fallbackY:106,fallbackSide:'bottom',sourceComponentId:'main-contact',sourcePinId:'6'}),
    Object.freeze({id:'14',label:'14NO',fallbackX:105,fallbackY:106,fallbackSide:'bottom',sourceComponentId:null,sourcePinId:null}),
    Object.freeze({id:'A2',label:'A2-',fallbackX:120,fallbackY:86,fallbackSide:'right',sourceComponentId:'coil-contactor',sourcePinId:'A2'})
  ]);

  const componentMap=Object.freeze({
    'converter-temperature':Object.freeze({
      productKey:'ordel-hmt-head-transmitter',
      assetKey:'ordel-top-v115',
      visualMatchStatus:'exact',
      visualOrientationStatus:'orthographic-front',
      visualSourceStatus:'repo-exact-product-visual',
      visualSourceFile:'ordel-top-v115.png',
      terminalGeometryStatus:'unverified',
      terminalGeometryRequiredForPanel:false,
      physicalRole:'standalone',
      panelEligible:false,
      primaryComponentId:'converter-temperature'
    }),
    'converter-pressure':Object.freeze({
      productKey:'weidmuller-8540300000',
      assetKey:'weid-front-v115',
      assetIdentityField:'instrument',
      assetIdentityValue:'waz5',
      visualMatchStatus:'exact',
      visualOrientationStatus:'source-image-derived-front',
      visualSourceStatus:'repo-existing-product-visual',
      visualSourceFile:'weid-front-v115.png',
      terminalGeometryStatus:'unverified',
      terminalGeometryRequiredForPanel:true,
      physicalRole:'standalone',
      panelEligible:false,
      primaryComponentId:'converter-pressure'
    }),
    'main-contact':Object.freeze({wireOverBody:true,productKey:'siemens-3rt2016-1bb41',assetKey:'siemens-contactor',visualMatchStatus:'exact',visualOrientationStatus:'source-image-derived-front',visualPolicyId:'panel-visual-derived-front-v1',visualSourceStatus:'derived-from-exact-repo-source',visualSourceFile:'siemens-3rt2016-1bb41-bare.jpg',visualSourcePage:'https://store.tremtech.com/siemens-3rt2016-1bb41-3-pole-9a-contactor-24vdc-coil/',visualDerivation:Object.freeze({method:'front-face-crop',sourceViewBox:'358 328 536 762',runtimeViewBox:'358 394 536 691',physicalFrameWidthMm:45,physicalFrameHeightMm:58}),terminalIdentityStatus:'verified',terminalIdentitySourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=3RT2016-1BB41',panelTerminals:siemens3rt2016PanelTerminals,terminalGeometryStatus:'verified',terminalSourceUrl:'https://static.siemens.com/mimes/10001000PNG/G_NSA0_XX_00814P.png',terminalGeometryMethod:'scaled-manufacturer-orthographic-drawing',terminalGeometryToleranceMm:1,terminalAnchors:Object.freeze({'1':Object.freeze({xMm:5,yMm:9.6,side:'top'}),'3':Object.freeze({xMm:14,yMm:9.6,side:'top'}),'5':Object.freeze({xMm:23,yMm:9.6,side:'top'}),'13':Object.freeze({xMm:32,yMm:9.6,side:'top'}),'A1':Object.freeze({xMm:41,yMm:9.6,side:'top'}),'2':Object.freeze({xMm:5,yMm:52.1,side:'bottom'}),'4':Object.freeze({xMm:14,yMm:52.1,side:'bottom'}),'6':Object.freeze({xMm:23,yMm:52.1,side:'bottom'}),'14':Object.freeze({xMm:32,yMm:52.1,side:'bottom'}),'A2':Object.freeze({xMm:41,yMm:52.1,side:'bottom'})}),physicalRole:'primary',panelEligible:true}),
    'coil-contactor':Object.freeze({productKey:'siemens-3rt2016-1bb41',assetKey:'siemens-contactor',visualMatchStatus:'exact',visualOrientationStatus:'source-image-derived-front',visualPolicyId:'panel-visual-derived-front-v1',terminalIdentityStatus:'verified',terminalIdentitySourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=3RT2016-1BB41',terminalGeometryStatus:'verified',terminalSourceUrl:'https://static.siemens.com/mimes/10001000PNG/G_NSA0_XX_00814P.png',terminalGeometryMethod:'scaled-manufacturer-orthographic-drawing',terminalGeometryToleranceMm:1,terminalAnchors:Object.freeze({'A1':Object.freeze({xMm:41,yMm:9.6,side:'top'}),'A2':Object.freeze({xMm:41,yMm:52.1,side:'bottom'})}),physicalRole:'logical-part',panelEligible:false,primaryComponentId:'main-contact'}),
    'smps':Object.freeze({wireOverBody:true,productKey:'weidmuller-2466870000',assetKey:'weidmuller-pro-top',visualMatchStatus:'exact',visualOrientationStatus:'source-image-derived-front',visualPolicyId:'panel-visual-derived-front-v1',visualSourceStatus:'derived-from-exact-repo-source',visualSourceFile:'weidmuller-pro-top-2466870000-derived-front.svg',visualDerivation:Object.freeze({method:'front-face-crop+nonuniform-rectification',sourceFile:'weidmuller-pro-top-2466870000.jpg',sourceViewBox:'218 86 248 690',runtimeViewBox:'0 0 350 1300',physicalFrameWidthMm:35,physicalFrameHeightMm:130}),terminalIdentityStatus:'verified',terminalIdentitySourceUrl:'https://datasheet.weidmueller.com/pdf/en/2466870000/scope/1/',terminalGeometryStatus:'verified',terminalSourceUrl:'https://eshop.weidmueller.com/en/pro-top1-120w-24v-5a/p/2466870000/downloads',terminalGeometryMethod:'exact-article-2d-dxf-mm-coordinate-extraction+nominal-frame-normalization',terminalGeometryToleranceMm:.5,terminalCadArchiveFile:'2466870000_DXF.zip',terminalCadArchiveSha256:'e248de04fa18ab287e5bc3b1fb5ebd07e5e6de768af32ab30dff46aeae8f2f48',terminalCadSourceFile:'2466870000_front.DXF',terminalCadSourceSha256:'17bd3bc956e6970c3915ab40d6a4158f0b05f1ac1f6f5db965c99af1ecf3c8c2',terminalCadEvidenceFile:'evidence/selection2/weidmuller-2466870000-dxf-terminal-evidence.json',terminalCadRawFrameMm:Object.freeze({width:34.000366024,height:131.2000114231,depth:135.4}),terminalCadNominalFrameMm:Object.freeze({width:35,height:130,depth:125}),terminalPhysicalRows:Object.freeze({output:Object.freeze(['P1','P2','M1','M2','M3']),input:Object.freeze(['L','N','PE'])}),terminalRuntimePhysicalMap:Object.freeze({P:'P1',M:'M1',L:'L',N:'N'}),terminalAnchors:Object.freeze({P:Object.freeze({xMm:5.7,yMm:3.8,side:'top'}),M:Object.freeze({xMm:16,yMm:3.8,side:'top'}),L:Object.freeze({xMm:12,yMm:124.8,side:'bottom'}),N:Object.freeze({xMm:17.2,yMm:124.8,side:'bottom'})})}),
    'fan-1p':Object.freeze({wireOverBody:true,productKey:'rittal-3241100',assetKey:'rittal-fan',visualMatchStatus:'exact',visualOrientationStatus:'source-image-derived-front',visualPolicyId:'panel-visual-derived-front-v1',visualSourceStatus:'derived-from-exact-repo-source',visualSourceFile:'rittal-3241100-derived-front.svg',visualDerivation:Object.freeze({method:'front-face-crop+nonuniform-rectification',sourceFile:'rittal-3241100.jpg',sourceViewBox:'63 29 180 251',runtimeViewBox:'0 0 510 510',physicalFrameWidthMm:255,physicalFrameHeightMm:255}),terminalGeometryStatus:'unverified',terminalGeometryRequiredForPanel:false}),
    'sinamics-v20-1p':Object.freeze({productKey:'siemens-6sl3210-5bb21-5uv1',assetKey:'sinamics-v20-book',wireOverBody:true,visualMatchStatus:'exact',visualOrientationStatus:'orthographic-front',terminalIdentityStatus:'verified',terminalIdentitySourceUrl:'https://cache.industry.siemens.com/dl/files/394/109768394/att_988984/v1/V20_op_instr_0419_en-US.pdf',terminalGeometryStatus:'verified',terminalSourceUrl:'https://mall.industry.siemens.com/mall/at/DE/Catalog/Product/?mlfb=6SL3210-5BB21-5UV1',terminalGeometryMethod:'exact-article-2d-dxf-mm-coordinate-extraction',terminalGeometryToleranceMm:.5,terminalCadFrameWidthMm:90.8,terminalCadFrameHeightMm:160.9,terminalCadSourceFile:'6SL3210-5BB21-5UV1_2D_dimension_withFrame_en.DXF',terminalCadSourceSha256:'323f43f81033c746e1b19740387cd3518e0c77478eecb422e2fbbc2324f91bfd',terminalPhysicalRows:Object.freeze({inputPower:Object.freeze(['PE','L1','N']),upperControl:Object.freeze(['13','13b','14','14b','12','15','16']),lowerControl:Object.freeze(['1','2','3','4','5','6','7','8','9','10','11']),relay:Object.freeze(['17','18','19']),outputPower:Object.freeze(['U','V','W','DC-','DC+','PE2'])}),terminalVisualOrderStatus:'verified',terminalVisualOrderSource:'Siemens V20 Operating Instructions FSAA-FSAD layout + exact 6SL3210-5BB21-5UV1 DXF',visualCalibration:Object.freeze({sourcePixelWidth:1086,sourcePixelHeight:1448,cropX:140,cropY:18,cropWidth:807,cropHeight:1430,renderPixelWidth:280,renderPixelHeight:496,physicalFrameWidthMm:90.8,physicalFrameHeightMm:160.9,sourceSha256:'a9a7b7d93f82dd7e81be67d807df718f484aa0b881beb0b562f3838a1b38a9d2',repoSha256:'c8db14a110d3df76375289d3bfb30c0b25f1eab71ea9839ab9ff72dd0ef29667'}),terminalAnchors:Object.freeze({'PE':Object.freeze({xMm:18.1,yMm:4.8,side:'top'}),'L1':Object.freeze({xMm:36,yMm:11.3,side:'top'}),'N':Object.freeze({xMm:45.5,yMm:11.3,side:'top'}),'13':Object.freeze({xMm:35.4,yMm:110.2,side:'bottom'}),'13b':Object.freeze({xMm:38.9,yMm:110.2,side:'bottom'}),'14':Object.freeze({xMm:42.4,yMm:110.2,side:'bottom'}),'14b':Object.freeze({xMm:45.9,yMm:110.2,side:'bottom'}),'12':Object.freeze({xMm:49.4,yMm:110.2,side:'bottom'}),'15':Object.freeze({xMm:52.9,yMm:110.2,side:'bottom'}),'16':Object.freeze({xMm:56.4,yMm:110.2,side:'bottom'}),'1':Object.freeze({xMm:20.7,yMm:122.2,side:'bottom'}),'2':Object.freeze({xMm:24.2,yMm:122.2,side:'bottom'}),'3':Object.freeze({xMm:27.7,yMm:122.2,side:'bottom'}),'4':Object.freeze({xMm:31.2,yMm:122.2,side:'bottom'}),'5':Object.freeze({xMm:34.7,yMm:122.2,side:'bottom'}),'6':Object.freeze({xMm:38.2,yMm:122.2,side:'bottom'}),'7':Object.freeze({xMm:41.7,yMm:122.2,side:'bottom'}),'8':Object.freeze({xMm:45.2,yMm:122.2,side:'bottom'}),'9':Object.freeze({xMm:48.7,yMm:122.2,side:'bottom'}),'10':Object.freeze({xMm:52.2,yMm:122.2,side:'bottom'}),'11':Object.freeze({xMm:55.7,yMm:122.2,side:'bottom'}),'17':Object.freeze({xMm:64.7,yMm:123.1,side:'bottom'}),'18':Object.freeze({xMm:68.2,yMm:123.1,side:'bottom'}),'19':Object.freeze({xMm:71.7,yMm:123.1,side:'bottom'}),'U':Object.freeze({xMm:21.5,yMm:148,side:'bottom'}),'V':Object.freeze({xMm:29.7,yMm:148,side:'bottom'}),'W':Object.freeze({xMm:37.9,yMm:148,side:'bottom'}),'DC-':Object.freeze({xMm:46.1,yMm:148,side:'bottom'}),'DC+':Object.freeze({xMm:54.3,yMm:148,side:'bottom'}),'PE2':Object.freeze({xMm:71.1,yMm:154.3,side:'bottom'})})}),
    'photoeye':Object.freeze({wireOverBody:true,productKey:'sick-wtb4-3p2161',assetKey:'sick-photoelectric',visualMatchStatus:'exact',visualOrientationStatus:'isometric-allowed',visualPolicyId:'sensor-visual-flex-v1',visualSourceStatus:'verified-manifest-provenance',visualSourceFile:'sick-wtb4.jpg',visualSourcePage:'https://nz.rs-online.com/web/p/photoelectric-sensors/5300939',visualSourceUrl:'https://media.rs-online.com/f_auto%2Cq_auto%2Cbo_1.5px_solid_white%2Cb_auto%2Cc_pad%2Cdpr_2%2Ch_399%2Cw_710/c_pad%2Ch_399%2Cw_710/F5300939-01?pgw=1',connectorIdentityStatus:'verified',connectorType:'M8-3-pin',connectorSourceUrl:'https://www.sick.com/media/pdf/6/76/976/dataSheet_WTB4-3P2161_1028099_en.pdf',connectorPinAssignment:Object.freeze({BN:1,BU:3,BK:4}),connectorLocationStatus:'verified-drawing-callout',connectorLocationEvidence:'WTx4-3 dimensional drawing callout 8 = Connection',terminalGeometryStatus:'connectorized-external'}),
    'disconnect-1p':Object.freeze({wireOverBody:true,productKey:'siemens-5tl1163-0',assetKey:'siemens-isolator-v113',assetIdentityField:'siemensPhoto',assetIdentityValue:'5TL1163-0',visualMatchStatus:'exact',visualOrientationStatus:'orthographic-front',visualSourceStatus:'user-supplied-canonical',visualSourceFile:'siemens-5tl1163-0-user-front.webp',visualSourceSha256:'b3950e10be92b92f556e5e50484f6d0c342cd0db951f670c018185c78ae618eb',visualCalibration:Object.freeze({sourcePixelWidth:180,sourcePixelHeight:861,renderPixelWidth:180,renderPixelHeight:861,physicalFrameWidthMm:18,physicalFrameHeightMm:89.8,unitsPerMm:10}),terminalIdentityStatus:'verified',terminalIdentitySourceUrl:'https://support.industry.siemens.com/cs/attachments/45315361/MAN_L1V30855940002-01_en_en-US.pdf',terminalGeometryStatus:'verified',terminalSourceUrl:'https://support.industry.siemens.com/cs/attachments/45315361/MAN_L1V30855940002-01_en_en-US.pdf',terminalGeometryMethod:'scaled-manufacturer-orthographic-drawing',terminalGeometryToleranceMm:2,terminalAnchors:Object.freeze({'1':Object.freeze({xMm:9,yMm:9,side:'top'}),'2':Object.freeze({xMm:9,yMm:80.8,side:'bottom'})})}),
    'thermal-magnetic':Object.freeze({wireOverBody:true,productKey:'siemens-3rv2011-1ja10',assetKey:'siemens-thermal-v113',assetIdentityField:'siemensPhoto',assetIdentityValue:'3RV2011-1JA10',visualMatchStatus:'exact',visualOrientationStatus:'orthographic-front',visualPolicyId:'panel-cad-front-v1',visualSourceStatus:'user-supplied-manufacturer-cad+exact-photo-evidence',visualSourceFile:'siemens-3rv2011-1ja10-cad-front.svg',visualIdentitySourceFile:'G_IC03_XX_33658V.tif',visualIdentitySourceSha256:'9d8acd3caf74929f6232572d3e809566f5e2f784b08861433d59e5d42442f975',visualCadSourceFile:'G_NSA0_XX_93051V.dxf',visualCadSourceSha256:'1a498a463cf58d2406ef86cbe1f3b2dc6f0301312344c35498336f57db8178b3',visualCadPreviewSha256:'f240d7bcb03e4e02d185dfe5d497f5192e0781d007bb0f5f5899b13821628342',visualCalibration:Object.freeze({renderPixelWidth:450,renderPixelHeight:970,physicalFrameWidthMm:45,physicalFrameHeightMm:97,unitsPerMm:10}),terminalIdentityStatus:'partial',terminalIdentitySourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=3RV2011-1JA10',verifiedTerminalIds:Object.freeze(['1','3','5','2','4','6']),terminalGeometryStatus:'verified',terminalSourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=3RV2011-1JA10',terminalGeometryMethod:'scaled-manufacturer-orthographic-drawing',terminalGeometryToleranceMm:1.5,terminalAnchors:Object.freeze({'1':Object.freeze({xMm:8,yMm:8,side:'top'}),'3':Object.freeze({xMm:22.5,yMm:8,side:'top'}),'5':Object.freeze({xMm:37,yMm:8,side:'top'}),'2':Object.freeze({xMm:8,yMm:90,side:'bottom'}),'4':Object.freeze({xMm:22.5,yMm:90,side:'bottom'}),'6':Object.freeze({xMm:37,yMm:90,side:'bottom'})})}),
    'mcb-1p':Object.freeze({productKey:'siemens-5sl6116-7',assetKey:'siemens-mcb1-v113',assetIdentityField:'siemensPhoto',assetIdentityValue:'5SL6116-7',visualMatchStatus:'exact',visualOrientationStatus:'orthographic-front',terminalIdentityStatus:'verified',terminalIdentitySourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=5SL61167',terminalGeometryStatus:'verified',terminalSourceUrl:'https://static.siemens.com/mimes/10001000PNG/G_I202_XX_26145P.png',terminalGeometryMethod:'scaled-manufacturer-orthographic-drawing',terminalGeometryToleranceMm:1,terminalAnchors:Object.freeze({'1':Object.freeze({xMm:9,yMm:13,side:'top'}),'2':Object.freeze({xMm:9,yMm:81.3,side:'bottom'})})}),
    'mcb-2p':Object.freeze({productKey:'siemens-5sl6216-7',assetKey:'siemens-mcb2-v113',assetIdentityField:'siemensPhoto',assetIdentityValue:'5SL6216-7',visualMatchStatus:'exact',visualOrientationStatus:'orthographic-front',terminalIdentityStatus:'verified',terminalIdentitySourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=5SL6216-7',terminalGeometryStatus:'verified',terminalSourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=5SL6216-7',terminalGeometryMethod:'manufacturer-5sl6-pole-pitch+verified-1p-y',terminalGeometryToleranceMm:1,terminalAnchors:Object.freeze({'1':Object.freeze({xMm:9,yMm:13,side:'top'}),'3':Object.freeze({xMm:27,yMm:13,side:'top'}),'2':Object.freeze({xMm:9,yMm:81.3,side:'bottom'}),'4':Object.freeze({xMm:27,yMm:81.3,side:'bottom'})})}),
    'mcb-3p':Object.freeze({productKey:'siemens-5sl6316-7',assetKey:'siemens-mcb3-v113',assetIdentityField:'siemensPhoto',assetIdentityValue:'5SL6316-7',visualMatchStatus:'exact',visualOrientationStatus:'orthographic-front',terminalIdentityStatus:'verified',terminalIdentitySourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=5SL6316-7',terminalGeometryStatus:'verified',terminalSourceUrl:'https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=5SL6316-7',terminalGeometryMethod:'manufacturer-5sl6-pole-pitch+verified-1p-y',terminalGeometryToleranceMm:1,terminalAnchors:Object.freeze({'1':Object.freeze({xMm:9,yMm:13,side:'top'}),'3':Object.freeze({xMm:27,yMm:13,side:'top'}),'5':Object.freeze({xMm:45,yMm:13,side:'top'}),'2':Object.freeze({xMm:9,yMm:81.3,side:'bottom'}),'4':Object.freeze({xMm:27,yMm:81.3,side:'bottom'}),'6':Object.freeze({xMm:45,yMm:81.3,side:'bottom'})})})
  });

  const clone=r=>r?JSON.parse(JSON.stringify(r)):null;
  function validClearanceTree(value){
    if(Number.isFinite(value))return value>=0;
    if(!value||typeof value!=='object'||Array.isArray(value))return false;
    const entries=Object.entries(value);
    return entries.length>0&&entries.every(([,child])=>validClearanceTree(child));
  }

  function validateProduct(record){
    if(!record||typeof record!=='object')return {ok:false,reason:'record'};
    if(typeof record.productKey!=='string'||!record.productKey)return {ok:false,reason:'productKey'};
    if(![record.widthMm,record.heightMm,record.depthMm].every(v=>Number.isFinite(v)&&v>0))return {ok:false,reason:'dimensions'};
    if(record.installationDepthMm!==undefined&&(!Number.isFinite(record.installationDepthMm)||record.installationDepthMm<=0))return {ok:false,reason:'installationDepth'};
    if(record.requiredClearanceMm!==undefined&&!validClearanceTree(record.requiredClearanceMm))return {ok:false,reason:'requiredClearance'};
    if(record.requiredClearanceByVoltageMm!==undefined&&!validClearanceTree(record.requiredClearanceByVoltageMm))return {ok:false,reason:'requiredClearanceByVoltage'};
    if(record.profileStatus!==undefined&&!VALID_PROFILE_STATUS.has(record.profileStatus))return {ok:false,reason:'profileStatus'};
    if(record.colliderStatus!==undefined&&!VALID_COLLIDER_STATUS.has(record.colliderStatus))return {ok:false,reason:'colliderStatus'};
    if(record.colliderStatus==='verified-profile'&&record.profileStatus!=='verified')return {ok:false,reason:'colliderProfileDependency'};
    if(record.colliderStatus==='verified-profile'){
      if(typeof record.colliderMethod!=='string'||!record.colliderMethod)return {ok:false,reason:'colliderMethod'};
      if(!Array.isArray(record.colliderProfileXZMm)||record.colliderProfileXZMm.length<3||record.colliderProfileXZMm.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.z)))return {ok:false,reason:'colliderProfile'};
    }
    if(record.profileStatus==='verified'){
      if(typeof record.profileMethod!=='string'||!record.profileMethod)return {ok:false,reason:'profileMethod'};
      if(typeof record.profileSourceUrl!=='string'||!/^https:\/\//.test(record.profileSourceUrl))return {ok:false,reason:'profileSourceUrl'};
      const b=record.profileBoundsMm;
      if(!b||![b.width,b.height,b.depth].every(v=>Number.isFinite(v)&&v>0))return {ok:false,reason:'profileBounds'};
      if(!Array.isArray(record.profileEvidenceFiles)||!record.profileEvidenceFiles.length||record.profileEvidenceFiles.some(x=>!x||typeof x.file!=='string'||!x.file||typeof x.sha256!=='string'||!/^[0-9a-f]{64}$/.test(x.sha256)||typeof x.role!=='string'||!x.role))return {ok:false,reason:'profileEvidenceFiles'};
    }
    if(!VALID_STATUS.has(record.sourceStatus))return {ok:false,reason:'sourceStatus'};
    if(!VALID_AUTHORITY.has(record.sourceAuthority))return {ok:false,reason:'sourceAuthority'};
    if(typeof record.sourceUrl!=='string'||!/^https:\/\//.test(record.sourceUrl))return {ok:false,reason:'sourceUrl'};
    if(typeof record.mountingType!=='string'||!record.mountingType)return {ok:false,reason:'mountingType'};
    if(!Array.isArray(record.allowedPanelMounts)||!record.allowedPanelMounts.length||record.allowedPanelMounts.some(v=>!['door','plate','rail','external'].includes(v)))return {ok:false,reason:'allowedPanelMounts'};
    if(!record.allowedPanelMounts.includes(record.defaultPanelMount))return {ok:false,reason:'defaultPanelMount'};
    return {ok:true};
  }

  function validateMapping(mapping){
    if(!mapping||typeof mapping!=='object')return {ok:false,reason:'mapping'};
    if(typeof mapping.productKey!=='string'||!products[mapping.productKey])return {ok:false,reason:'productKey'};
    if(typeof mapping.assetKey!=='string'||!mapping.assetKey.trim())return {ok:false,reason:'assetKey'};
    if(mapping.assetIdentityField!==undefined&&!VALID_ASSET_IDENTITY_FIELDS.has(mapping.assetIdentityField))return {ok:false,reason:'assetIdentityField'};
    if(mapping.assetIdentityField!==undefined&&(typeof mapping.assetIdentityValue!=='string'||!mapping.assetIdentityValue.trim()))return {ok:false,reason:'assetIdentityValue'};
    if(mapping.visualSourceStatus!==undefined&&mapping.visualSourceStatus!==null&&!['repo-exact-product-visual','repo-existing-product-visual','derived-from-exact-repo-source','verified-manifest-provenance','user-supplied-canonical','user-supplied-manufacturer-cad+exact-photo-evidence'].includes(mapping.visualSourceStatus))return {ok:false,reason:'visualSourceStatus'};
    if(mapping.visualSourceFile!==undefined&&mapping.visualSourceFile!==null&&(typeof mapping.visualSourceFile!=='string'||!mapping.visualSourceFile.trim()))return {ok:false,reason:'visualSourceFile'};
    if(!VALID_VISUAL_MATCH.has(mapping.visualMatchStatus))return {ok:false,reason:'visualMatchStatus'};
    if(!VALID_VISUAL_ORIENTATION.has(mapping.visualOrientationStatus))return {ok:false,reason:'visualOrientationStatus'};
    if(!VALID_TERMINAL_STATUS.has(mapping.terminalGeometryStatus))return {ok:false,reason:'terminalGeometryStatus'};
    if(mapping.terminalIdentityStatus!==undefined&&!VALID_TERMINAL_IDENTITY_STATUS.has(mapping.terminalIdentityStatus))return {ok:false,reason:'terminalIdentityStatus'};
    if(['verified','partial'].includes(mapping.terminalIdentityStatus)&&(typeof mapping.terminalIdentitySourceUrl!=='string'||!/^https:\/\/[^/\s?#]+\.[^/\s?#]+(?:[/?#]|$)/i.test(mapping.terminalIdentitySourceUrl)))return {ok:false,reason:'terminalIdentitySourceUrl'};
    if(mapping.terminalIdentityStatus==='partial'){
      if(!Array.isArray(mapping.verifiedTerminalIds)||!mapping.verifiedTerminalIds.length)return {ok:false,reason:'verifiedTerminalIds'};
      const ids=new Set();for(const id of mapping.verifiedTerminalIds)if(typeof id!=='string'||!id||ids.has(id))return {ok:false,reason:'verifiedTerminalIds'};else ids.add(id);
    }
    if(mapping.verifiedTerminalIds!==undefined&&!['verified','partial'].includes(mapping.terminalIdentityStatus))return {ok:false,reason:'verifiedTerminalIds'};
    if(mapping.connectorIdentityStatus!==undefined){
      if(mapping.connectorIdentityStatus!=='verified')return {ok:false,reason:'connectorIdentityStatus'};
      if(typeof mapping.connectorType!=='string'||!mapping.connectorType)return {ok:false,reason:'connectorType'};
      if(typeof mapping.connectorSourceUrl!=='string'||!/^https:\/\//.test(mapping.connectorSourceUrl))return {ok:false,reason:'connectorSourceUrl'};
      const pins=Object.entries(mapping.connectorPinAssignment||{});
      if(!pins.length||pins.some(([k,v])=>typeof k!=='string'||!k||!Number.isInteger(v)||v<=0)||new Set(pins.map(([,v])=>v)).size!==pins.length)return {ok:false,reason:'connectorPinAssignment'};
      if(mapping.connectorLocationStatus!=='verified-drawing-callout')return {ok:false,reason:'connectorLocationStatus'};
    }
    if(mapping.physicalRole!==undefined&&!['primary','logical-part','standalone'].includes(mapping.physicalRole))return {ok:false,reason:'physicalRole'};
    if(mapping.panelEligible!==undefined&&typeof mapping.panelEligible!=='boolean')return {ok:false,reason:'panelEligible'};
    if(mapping.panelEligible===false&&typeof mapping.primaryComponentId!=='string')return {ok:false,reason:'primaryComponentId'};
    if(mapping.panelTerminals!==undefined){
      if(!Array.isArray(mapping.panelTerminals)||!mapping.panelTerminals.length)return {ok:false,reason:'panelTerminals'};
      if(mapping.terminalIdentityStatus!=='verified')return {ok:false,reason:'terminalIdentityStatus'};
      if(typeof mapping.terminalIdentitySourceUrl!=='string'||!/^https:\/\//.test(mapping.terminalIdentitySourceUrl))return {ok:false,reason:'terminalIdentitySourceUrl'};
      const ids=new Set();
      for(const p of mapping.panelTerminals){
        if(!p||typeof p.id!=='string'||!p.id||ids.has(p.id))return {ok:false,reason:'panelTerminalId'};
        ids.add(p.id);
        if(typeof p.label!=='string'||!p.label||!Number.isFinite(p.fallbackX)||!Number.isFinite(p.fallbackY)||!['top','bottom','left','right'].includes(p.fallbackSide))return {ok:false,reason:'panelTerminalFallback'};
      }
    }
    if(mapping.terminalGeometryStatus==='connectorized-external'&&mapping.connectorIdentityStatus!=='verified')return {ok:false,reason:'connectorizedExternalIdentity'};
    if(mapping.terminalGeometryRequiredForPanel!==undefined&&typeof mapping.terminalGeometryRequiredForPanel!=='boolean')return {ok:false,reason:'terminalGeometryRequiredForPanel'};
    if(mapping.terminalGeometryStatus==='verified'){
      if(typeof mapping.terminalSourceUrl!=='string'||!/^https:\/\//.test(mapping.terminalSourceUrl))return {ok:false,reason:'terminalSourceUrl'};
      const entries=Object.entries(mapping.terminalAnchors||{});
      if(!entries.length)return {ok:false,reason:'terminalAnchors'};
      const product=products[mapping.productKey];
      for(const [,a] of entries)if(!a||!Number.isFinite(a.xMm)||!Number.isFinite(a.yMm)||a.xMm<0||a.yMm<0||a.xMm>product.widthMm||a.yMm>product.heightMm||!['top','bottom','left','right'].includes(a.side))return {ok:false,reason:'terminalAnchor'};
    }
    return {ok:true};
  }

  function panelGeometryGate(product,mapping,component){
    const reasons=[];
    if(!product||product.sourceStatus!=='verified')reasons.push('verified-product-dimensions');
    if(!mapping||mapping.visualMatchStatus!=='exact')reasons.push('exact-visual');
    const sensorFlexible=mapping?.visualPolicyId==='sensor-visual-flex-v1'&&['orthographic-front','front-lens','isometric','three-quarter','isometric-allowed'].includes(mapping?.visualOrientationStatus);
    const derivedFront=mapping?.visualPolicyId==='panel-visual-derived-front-v1'&&mapping?.visualOrientationStatus==='source-image-derived-front';
    if(!mapping||(!sensorFlexible&&!derivedFront&&mapping.visualOrientationStatus!=='orthographic-front'))reasons.push('orthographic-front');
    const connectorizedExternal=product?.mountingType==='field-device'&&mapping?.connectorIdentityStatus==='verified';
    const terminalRequired=mapping?.terminalGeometryRequiredForPanel!==false&&!connectorizedExternal&&((Array.isArray(component?.pins)&&component.pins.length>0)||(Array.isArray(mapping?.panelTerminals)&&mapping.panelTerminals.length>0));
    if(terminalRequired&&mapping?.terminalGeometryStatus!=='verified')reasons.push('verified-terminal-geometry');
    return {ready:reasons.length===0,reasons};
  }

  function get(component){
    if(!component||typeof component.id!=='string')return null;
    const mapping=componentMap[component.id];
    if(!mapping||!validateMapping(mapping).ok)return null;
    const identityField=mapping.assetIdentityField||'materialAsset',identityValue=mapping.assetIdentityValue||mapping.assetKey;
    if(identityValue&&component[identityField]!==identityValue)return null;
    const product=products[mapping.productKey];
    const check=validateProduct(product);
    return check.ok?{...clone(product),componentId:component.id,assetKey:mapping.assetKey,visualMatchStatus:mapping.visualMatchStatus,visualOrientationStatus:mapping.visualOrientationStatus,terminalIdentityStatus:mapping.terminalIdentityStatus||'unverified',terminalIdentitySourceUrl:mapping.terminalIdentitySourceUrl||null,verifiedTerminalIds:clone(mapping.verifiedTerminalIds||[]),terminalGeometryStatus:mapping.terminalGeometryStatus,terminalGeometryMethod:mapping.terminalGeometryMethod||null,terminalGeometryToleranceMm:Number.isFinite(mapping.terminalGeometryToleranceMm)?mapping.terminalGeometryToleranceMm:null,terminalSourceUrl:mapping.terminalSourceUrl||null,wireOverBody:mapping.wireOverBody===true,visualSourceStatus:mapping.visualSourceStatus||null,visualSourceFile:mapping.visualSourceFile||null,visualSourceSha256:mapping.visualSourceSha256||null,visualSourcePage:mapping.visualSourcePage||null,visualSourceUrl:mapping.visualSourceUrl||null,visualPolicyId:mapping.visualPolicyId||null,connectorIdentityStatus:mapping.connectorIdentityStatus||'unverified',connectorType:mapping.connectorType||null,connectorSourceUrl:mapping.connectorSourceUrl||null,connectorPinAssignment:clone(mapping.connectorPinAssignment||null),connectorLocationStatus:mapping.connectorLocationStatus||null,connectorLocationEvidence:mapping.connectorLocationEvidence||null,visualDerivation:clone(mapping.visualDerivation||null),visualCalibration:clone(mapping.visualCalibration||null),physicalRole:mapping.physicalRole||'standalone',panelEligible:mapping.panelEligible!==false,primaryComponentId:mapping.primaryComponentId||component.id}:null;
  }

  function panelEligibility(component){
    const mapping=componentMap[component?.id];
    if(!mapping)return {eligible:true,role:'unmapped',primaryComponentId:component?.id||null};
    return {eligible:mapping.panelEligible!==false,role:mapping.physicalRole||'standalone',productKey:mapping.productKey,primaryComponentId:mapping.primaryComponentId||component.id};
  }

  function panelPins(component){
    const mapping=componentMap[component?.id],record=get(component);
    if(!mapping||!record||mapping.physicalRole!=='primary'||!Array.isArray(mapping.panelTerminals))return clone(component?.pins||[]);
    return mapping.panelTerminals.map(p=>({
      id:p.id,label:p.label,x:p.fallbackX,y:p.fallbackY,side:p.fallbackSide,
      geometryStatus:'approximate',geometrySource:null,
      sourceComponentId:p.sourceComponentId||null,sourcePinId:p.sourcePinId||null,
      terminalIdentityStatus:mapping.terminalIdentityStatus,
      terminalIdentitySourceUrl:mapping.terminalIdentitySourceUrl
    }));
  }

  function terminalIdentity(component,pinId){
    const mapping=componentMap[component?.id],record=get(component),id=String(pinId);
    if(!record||!mapping)return {pinId:id,status:'unverified',sourceUrl:null};
    if(mapping.terminalIdentityStatus==='verified')return {pinId:id,status:'verified',sourceUrl:mapping.terminalIdentitySourceUrl||null};
    if(mapping.terminalIdentityStatus==='partial'&&mapping.verifiedTerminalIds?.includes(id))return {pinId:id,status:'verified',sourceUrl:mapping.terminalIdentitySourceUrl||null};
    return {pinId:id,status:'unverified',sourceUrl:null};
  }

  function terminalGeometryEvidence(component,pinId){
    const mapping=componentMap[component?.id],record=get(component);
    if(!record||!mapping||mapping.terminalGeometryStatus!=='verified')return null;
    const a=mapping.terminalAnchors?.[pinId];
    if(!a)return null;
    return {pinId:String(pinId),xMm:a.xMm,yMm:a.yMm,side:a.side,status:'verified',sourceUrl:mapping.terminalSourceUrl,method:mapping.terminalGeometryMethod||null,toleranceMm:Number.isFinite(mapping.terminalGeometryToleranceMm)?mapping.terminalGeometryToleranceMm:null};
  }

  function terminalAnchor(component,pinId){
    const mapping=componentMap[component?.id],evidence=terminalGeometryEvidence(component,pinId);
    const sensorFlexible=mapping?.visualPolicyId==='sensor-visual-flex-v1'&&['orthographic-front','front-lens','isometric','three-quarter','isometric-allowed'].includes(mapping?.visualOrientationStatus);
    const derivedFront=mapping?.visualPolicyId==='panel-visual-derived-front-v1'&&mapping?.visualOrientationStatus==='source-image-derived-front';
    if(!mapping||!evidence||mapping.visualMatchStatus!=='exact'||(!sensorFlexible&&!derivedFront&&mapping.visualOrientationStatus!=='orthographic-front'))return null;
    return {pinId:evidence.pinId,xMm:evidence.xMm,yMm:evidence.yMm,side:evidence.side,status:evidence.status,sourceUrl:evidence.sourceUrl};
  }

  function panelSpec(component){
    const record=get(component);
    if(!record||record.sourceStatus!=='verified')return null;
    const mapping=componentMap[component?.id],product=products[mapping?.productKey],gate=panelGeometryGate(product,mapping,component),geometryReady=record.panelGeometryReady===true&&gate.ready;
    return {
      physicalWidthMm:record.widthMm,
      physicalHeightMm:record.heightMm,
      physicalDepthMm:record.depthMm,
      physicalDimensionStatus:'verified',
      panelGeometryStatus:geometryReady?'ready':'staged',
      panelGeometryBlockers:geometryReady?[]:[...(record.panelGeometryReady===true?[]:['panel-geometry-not-promoted']),...gate.reasons],
      dimensionSource:record.sourceUrl,
      dimensionAuthority:record.sourceAuthority,
      physicalProductKey:record.productKey,
      physicalModel:record.model,
      physicalAsset:record.assetKey||null,
      visualMatchStatus:record.visualMatchStatus,
      visualOrientationStatus:record.visualOrientationStatus,
      terminalIdentityStatus:record.terminalIdentityStatus,
      terminalIdentitySourceUrl:record.terminalIdentitySourceUrl,
      verifiedTerminalIds:[...record.verifiedTerminalIds],
      terminalGeometryStatus:record.terminalGeometryStatus,
      terminalGeometryMethod:record.terminalGeometryMethod,
      terminalGeometryToleranceMm:record.terminalGeometryToleranceMm,
      terminalSourceUrl:record.terminalSourceUrl,
      profileStatus:record.profileStatus||'unverified',
      profileMethod:record.profileMethod||null,
      profileSourceUrl:record.profileSourceUrl||null,
      profileBoundsMm:record.profileBoundsMm?clone(record.profileBoundsMm):null,
      profileEvidenceFiles:record.profileEvidenceFiles?clone(record.profileEvidenceFiles):[],
      profileEvidence:record.profileEvidence?clone(record.profileEvidence):null,
      colliderStatus:record.colliderStatus||'conservative-envelope',
      colliderMethod:record.colliderMethod||null,
      colliderProfileXZMm:record.colliderProfileXZMm?clone(record.colliderProfileXZMm):null,
      colliderDecision:record.colliderDecision||null,
      physicalRole:record.physicalRole,
      panelEligible:record.panelEligible,
      primaryComponentId:record.primaryComponentId,
      mountingType:record.mountingType,
      allowedPanelMounts:[...record.allowedPanelMounts],
      defaultPanelMount:record.defaultPanelMount,
      ...(geometryReady?{w:record.widthMm,h:record.heightMm,depth:record.depthMm}:{}),
      ...(Number.isFinite(record.projectionDepthMm)?{projectionDepthMm:record.projectionDepthMm}:{}),
      ...(record.requiredClearanceMm?{requiredClearanceMm:clone(record.requiredClearanceMm)}:{}),
      ...(record.requiredClearanceByVoltageMm?{requiredClearanceByVoltageMm:clone(record.requiredClearanceByVoltageMm)}:{}),
      ...(Number.isFinite(record.mountingCutoutWidthMm)?{mountingCutoutWidthMm:record.mountingCutoutWidthMm}:{}),
      ...(Number.isFinite(record.mountingCutoutHeightMm)?{mountingCutoutHeightMm:record.mountingCutoutHeightMm}:{}),
      ...(record.depthMeaning?{depthMeaning:record.depthMeaning}:{}),
      ...(record.frameSize?{frameSize:record.frameSize}:{})
    };
  }

  function coverage(library=[]){
    let mapped=0,verified=0,verifiedProfiles=0,verifiedProfileColliders=0;
    for(const component of library){
      if(componentMap[component?.id])mapped++;
      const record=get(component);
      if(record?.sourceStatus==='verified')verified++;
      if(record?.profileStatus==='verified')verifiedProfiles++;
      if(record?.colliderStatus==='verified-profile')verifiedProfileColliders++;
    }
    return {library:library.length,products:Object.keys(products).length,mappings:Object.keys(componentMap).length,mapped,verified,verifiedProfiles,verifiedProfileColliders};
  }

  function materialScaleAudit(component,options={}){
    const record=get(component),sceneW=Number(component?.w),sceneH=Number(component?.h),aspectTolerance=Math.max(0,Number(options.aspectTolerance??0.05)||0);
    if(!record||record.sourceStatus!=='verified')return {status:'unverified-physical-dimensions',componentId:component?.id||null,productKey:record?.productKey||null};
    if(![sceneW,sceneH,record.widthMm,record.heightMm].every(v=>Number.isFinite(v)&&v>0))return {status:'invalid-dimensions',componentId:component?.id||null,productKey:record.productKey};
    const sceneAspect=sceneW/sceneH,physicalAspect=record.widthMm/record.heightMm,aspectError=Math.abs(sceneAspect/physicalAspect-1),unitsPerMm={x:sceneW/record.widthMm,y:sceneH/record.heightMm};
    return {
      status:aspectError>aspectTolerance?'distorted-aspect':'aspect-consistent',
      componentId:component.id,
      productKey:record.productKey,
      scene:{w:sceneW,h:sceneH,aspect:sceneAspect},
      physical:{w:record.widthMm,h:record.heightMm,aspect:physicalAspect},
      unitsPerMm,
      aspectError,
      aspectTolerance
    };
  }

  function materialScaleCoverage(library=[],options={}){
    const rows=library.map(d=>materialScaleAudit(d,options)),verified=rows.filter(r=>r.status!=='unverified-physical-dimensions'&&r.status!=='invalid-dimensions'),distorted=verified.filter(r=>r.status==='distorted-aspect');
    return {library:library.length,verified:verified.length,distorted:distorted.length,rows};
  }

  const MATERIAL_SCENE_UNITS_PER_MM=2;
  function materialDefinition(component,options={}){
    if(!component||component._physicalMaterialNormalized)return component;
    if(component.instrument||component.isPLC||component.arduinoPeripheral||component.designMaterial||component.materialSymbol||component._auxOnly)return component;
    const units=Math.max(.1,Number(options.sceneUnitsPerMm??MATERIAL_SCENE_UNITS_PER_MM)||MATERIAL_SCENE_UNITS_PER_MM),record=get(component);
    const requested=component.physicalDimensionsMm,userLocked=component.physicalScaleSource==='workspace-space-v1:user-locked'&&requested&&[requested.width,requested.height,component.w,component.h].every(v=>Number.isFinite(v)&&v>0);
    const conflictsWithVerified=userLocked&&record&&record.sourceStatus==='verified'&&(Math.abs(requested.width-record.widthMm)>1e-9||Math.abs(requested.height-record.heightMm)>1e-9);
    if(conflictsWithVerified){
      const w=requested.width*units,h=requested.height*units,sx=w/component.w,sy=h/component.h;
      const pins=(component.pins||[]).map(p=>({...p,x:p.x*sx,y:p.y*sy}));
      return {...component,w,h,pins,materialPins:null,_physicalMaterialNormalized:true,_materialSceneUnitsPerMm:units,_materialScaleSource:'workspace-space-v1:user-locked'};
    }
    if(!record||record.sourceStatus!=='verified'||![record.widthMm,record.heightMm,component.w,component.h].every(v=>Number.isFinite(v)&&v>0))return component;
    const w=record.widthMm*units,h=record.heightMm*units,sx=w/component.w,sy=h/component.h;
    const mapping=componentMap[component?.id];
    const pins=(component.pins||[]).map(p=>{
      const evidence=mapping?.visualMatchStatus==='exact'?terminalGeometryEvidence(component,p.id):null;
      return evidence?{...p,x:evidence.xMm*units,y:evidence.yMm*units,side:evidence.side||p.side}:{...p,x:p.x*sx,y:p.y*sy};
    });
    return {...component,w,h,pins,materialPins:null,_physicalMaterialNormalized:true,_materialSceneUnitsPerMm:units,_materialScaleSource:'verified-physical-body'};
  }

  function materialLayoutAudit(components=[],byId={},options={}){
    const rows=[],overlaps=[],margin=Math.max(0,Number(options.margin??0)||0);
    for(const instance of Array.isArray(components)?components:[]){
      const base=byId?.[instance?.typeId];if(!base)continue;
      const d=materialDefinition(base,options);
      if(d===base||!d._physicalMaterialNormalized)continue;
      const scale=Number(instance.materialScale)>0?Number(instance.materialScale):1,rotation=((Number(instance.rotation)||0)%360+360)%360,quarter=rotation===90||rotation===270;
      const w=d.w*scale,h=d.h*scale,bw=quarter?h:w,bh=quarter?w:h,cx=Number(instance.x)+w/2,cy=Number(instance.y)+h/2;
      if(![cx,cy,bw,bh].every(Number.isFinite))continue;
      rows.push({id:instance.id||null,ref:instance.ref||null,typeId:instance.typeId,productKey:get(base)?.productKey||null,left:cx-bw/2,top:cy-bh/2,right:cx+bw/2,bottom:cy+bh/2,width:bw,height:bh});
    }
    for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
      const a=rows[i],b=rows[j],ix=Math.min(a.right,b.right)-Math.max(a.left,b.left),iy=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
      if(ix>margin&&iy>margin)overlaps.push({a:a.id,b:b.id,aRef:a.ref,bRef:b.ref,aTypeId:a.typeId,bTypeId:b.typeId,overlapWidth:ix,overlapHeight:iy,overlapArea:ix*iy});
    }
    return {ok:overlaps.length===0,normalized:rows.length,overlapCount:overlaps.length,margin,rows,overlaps};
  }

  const api={products,records:products,componentMap,get,panelSpec,panelGeometryGate,panelEligibility,panelPins,terminalIdentity,terminalGeometryEvidence,terminalAnchor,MATERIAL_SCENE_UNITS_PER_MM,materialScaleAudit,materialScaleCoverage,materialDefinition,materialLayoutAudit,validateProduct,validateRecord:validateProduct,validateMapping,coverage};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSPhysicalMetadata=api;
})(typeof window!=='undefined'?window:globalThis);
