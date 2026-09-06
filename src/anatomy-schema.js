const secondarySystems={
  pancreas:['endocrine'],
  tongue:['sensory'],
  'nasal-cavity':['sensory'],
  'ovary--1':['endocrine'],
  'ovary-1':['endocrine'],
  'testis--1':['endocrine'],
  'testis-1':['endocrine'],
  spleen:['circulatory'],
  thymus:['endocrine']
};

const teachingOverrides={
  heart:{
    location:['อยู่ในช่องอกส่วนกลางค่อนไปทางซ้าย ระหว่างปอดทั้งสองและเหนือกะบังลม','Located in the mediastinum between the lungs, slightly left of midline and superior to the diaphragm.'],
    relations:['เชื่อมต่อกับหลอดเลือดแดงใหญ่ หลอดเลือดดำใหญ่ และหลอดเลือดปอด','Connected to the aorta, venae cavae, pulmonary arteries and pulmonary veins.'],
    clinical:['ความผิดปกติของหลอดเลือดหัวใจ ลิ้นหัวใจ หรือกล้ามเนื้อหัวใจอาจรบกวนการสูบฉีดเลือด','Coronary, valvular or myocardial disorders can impair effective pumping.']
  },
  pancreas:{
    location:['อยู่ด้านหลังกระเพาะอาหาร พาดจากลำไส้เล็กส่วนต้นไปทางม้าม','Lies posterior to the stomach, extending from the duodenum toward the spleen.'],
    relations:['ทำงานทั้งในระบบย่อยอาหารโดยหลั่งเอนไซม์ และระบบต่อมไร้ท่อโดยหลั่งอินซูลิน/กลูคากอน','Functions in digestion through enzyme secretion and in the endocrine system through insulin and glucagon.'],
    clinical:['ความผิดปกติของส่วนต่อมไร้ท่อสัมพันธ์กับการควบคุมระดับกลูโคส ส่วนท่อของตับอ่อนเกี่ยวข้องกับการย่อยอาหาร','Endocrine dysfunction affects glucose regulation, while exocrine duct disorders affect digestion.']
  },
  tongue:{
    location:['อยู่ภายในช่องปาก ยึดกับพื้นช่องปากและกระดูกไฮออยด์ผ่านกล้ามเนื้อหลายมัด','Located in the oral cavity and anchored to the floor of the mouth and hyoid region by muscles.'],
    relations:['เกี่ยวข้องทั้งการเคี้ยว กลืน การออกเสียง และการรับรส','Participates in chewing, swallowing, speech and taste.'],
    clinical:['การบาดเจ็บของเส้นประสาทหรือกล้ามเนื้อลิ้นอาจส่งผลต่อการพูดและการกลืน','Neuromuscular injury can affect speech and swallowing.']
  },
  'nasal-cavity':{
    location:['อยู่ภายในจมูกเหนือช่องปาก เชื่อมต่อกับคอหอยด้านหลัง','Located within the nose superior to the oral cavity and continuous posteriorly with the pharynx.'],
    relations:['ทำหน้าที่ปรับสภาพอากาศและมีบริเวณรับกลิ่นเชื่อมกับระบบประสาท','Conditions inhaled air and contains olfactory regions linked to the nervous system.'],
    clinical:['การอักเสบหรืออุดตันอาจรบกวนการหายใจทางจมูกและการรับกลิ่น','Inflammation or obstruction can affect nasal breathing and smell.']
  },
  liver:{
    location:['อยู่ช่องท้องด้านขวาบน ใต้กะบังลม','Located mainly in the right upper abdomen beneath the diaphragm.'],
    relations:['รับเลือดจากหลอดเลือดดำพอร์ทัลตับและหลอดเลือดแดงตับ และส่งน้ำดีสู่ทางเดินน้ำดี','Receives blood from the hepatic portal vein and hepatic artery and sends bile into the biliary tract.'],
    clinical:['โรคตับอาจกระทบการเผาผลาญ การกำจัดสาร และการสร้างน้ำดี','Liver disease can affect metabolism, detoxification and bile production.']
  },
  'lung-left':{
    location:['อยู่ช่องอกด้านซ้าย ล้อมรอบด้วยเยื่อหุ้มปอดและอยู่เหนือกะบังลม','Located in the left thoracic cavity within the pleura and superior to the diaphragm.'],
    relations:['เชื่อมกับหลอดลมใหญ่ซ้ายและหลอดเลือดปอด และมีรอยเว้าสำหรับหัวใจ','Connected to the left main bronchus and pulmonary vessels and has a cardiac impression.'],
    clinical:['โรคทางเดินหายใจหรือถุงลมอาจลดประสิทธิภาพการแลกเปลี่ยนแก๊ส','Airway or alveolar disease can reduce gas-exchange efficiency.']
  },
  'lung-right':{
    location:['อยู่ช่องอกด้านขวา ล้อมรอบด้วยเยื่อหุ้มปอดและอยู่เหนือกะบังลม','Located in the right thoracic cavity within the pleura and superior to the diaphragm.'],
    relations:['เชื่อมกับหลอดลมใหญ่ขวาและหลอดเลือดปอด และแบ่งเป็น 3 กลีบ','Connected to the right main bronchus and pulmonary vessels and divided into three lobes.'],
    clinical:['โรคทางเดินหายใจหรือถุงลมอาจลดประสิทธิภาพการแลกเปลี่ยนแก๊ส','Airway or alveolar disease can reduce gas-exchange efficiency.']
  }
};

const systemFallbacks={
  nervous:{location:['อยู่ตามแนวระบบประสาทส่วนกลางหรือส่วนปลายของร่างกาย','Located within the central or peripheral nervous system.'],relations:['เชื่อมโยงการรับข้อมูล การประมวลผล และการส่งคำสั่งของระบบประสาท','Supports information reception, processing and neural signaling.'],clinical:['ความผิดปกติของโครงสร้างประสาทอาจกระทบการรับความรู้สึก การเคลื่อนไหว หรือการควบคุมอัตโนมัติ','Nervous-system disorders may affect sensation, movement or autonomic control.']},
  respiratory:{location:['อยู่ตามทางเดินหายใจหรือภายในช่องอก','Located along the respiratory tract or within the thoracic cavity.'],relations:['ทำงานร่วมกับทางเดินอากาศ ปอด กะบังลม และระบบไหลเวียนเลือดเพื่อการแลกเปลี่ยนแก๊ส','Works with the airways, lungs, diaphragm and circulation to support gas exchange.'],clinical:['การอุดกั้น การอักเสบ หรือการเสียหายของเนื้อเยื่อหายใจอาจลดการระบายอากาศหรือการแลกเปลี่ยนแก๊ส','Obstruction, inflammation or tissue damage can impair ventilation or gas exchange.']},
  circulatory:{location:['อยู่ในหัวใจหรือเครือข่ายหลอดเลือดทั่วร่างกาย','Located in the heart or vascular network throughout the body.'],relations:['เชื่อมต่อกับหัวใจ หลอดเลือด และเนื้อเยื่อเพื่อขนส่งเลือดและสารต่าง ๆ','Connects the heart, vessels and tissues for transport of blood and dissolved substances.'],clinical:['ความผิดปกติของการไหลเวียนอาจลดการส่งออกซิเจนและสารอาหารไปยังเนื้อเยื่อ','Circulatory disorders can reduce oxygen and nutrient delivery to tissues.']},
  digestive:{location:['อยู่ตามทางเดินอาหารหรืออวัยวะช่วยย่อยในช่องท้อง','Located along the gastrointestinal tract or in accessory digestive organs.'],relations:['ทำงานร่วมกับอวัยวะย่อยอาหารเพื่อย่อย ดูดซึม และขับกากอาหาร','Works with digestive organs to digest, absorb and eliminate material.'],clinical:['การอักเสบ การอุดตัน หรือการทำงานผิดปกติอาจกระทบการย่อยและการดูดซึม','Inflammation, obstruction or dysfunction can affect digestion and absorption.']},
  urinary:{location:['อยู่บริเวณช่องท้อง เชิงกราน หรือทางเดินปัสสาวะ','Located in the abdomen, pelvis or urinary tract.'],relations:['ทำงานร่วมกับไต ท่อไต กระเพาะปัสสาวะ และท่อปัสสาวะเพื่อควบคุมของเหลวและขับปัสสาวะ','Works with the kidneys, ureters, bladder and urethra to regulate fluids and eliminate urine.'],clinical:['ความผิดปกติอาจกระทบการกรอง สมดุลน้ำเกลือแร่ หรือการไหลของปัสสาวะ','Disorders can affect filtration, fluid-electrolyte balance or urine flow.']},
  endocrine:{location:['อยู่ในต่อมไร้ท่อหรือเนื้อเยื่อที่หลั่งฮอร์โมนในหลายตำแหน่งของร่างกาย','Located in endocrine glands or hormone-secreting tissues throughout the body.'],relations:['หลั่งฮอร์โมนเข้าสู่เลือดเพื่อควบคุมอวัยวะเป้าหมายและรักษาสมดุลภายใน','Releases hormones into blood to regulate target organs and homeostasis.'],clinical:['ความผิดปกติของฮอร์โมนอาจส่งผลต่อการเจริญเติบโต การเผาผลาญ และสมดุลของร่างกาย','Hormonal disorders can affect growth, metabolism and homeostasis.']},
  lymphatic:{location:['อยู่ในอวัยวะน้ำเหลือง ต่อมน้ำเหลือง หรือแนวหลอดน้ำเหลือง','Located in lymphatic organs, lymph nodes or lymphatic pathways.'],relations:['ช่วยคืนของเหลวสู่ระบบไหลเวียนและสนับสนุนภูมิคุ้มกัน','Helps return tissue fluid to circulation and supports immune defense.'],clinical:['การอุดตันหรือความผิดปกติของระบบน้ำเหลืองอาจทำให้บวมและกระทบภูมิคุ้มกัน','Lymphatic obstruction or dysfunction can contribute to swelling and impaired immune function.']},
  reproductive:{location:['อยู่บริเวณเชิงกรานหรืออวัยวะสืบพันธุ์ภายนอก','Located in the pelvis or external reproductive anatomy.'],relations:['เกี่ยวข้องกับการสร้างเซลล์สืบพันธุ์ ฮอร์โมน และการสืบพันธุ์','Participates in gamete production, hormonal function and reproduction.'],clinical:['ความผิดปกติอาจส่งผลต่อภาวะเจริญพันธุ์ การทำงานทางเพศ หรือฮอร์โมน','Disorders may affect fertility, sexual function or hormonal regulation.']},
  skeletal:{location:['เป็นส่วนหนึ่งของโครงกระดูกแกนกลางหรือโครงกระดูกแขนขา','Part of the axial or appendicular skeleton.'],relations:['เชื่อมต่อกับกระดูก ข้อต่อ เอ็น และกล้ามเนื้อเพื่อพยุงและเคลื่อนไหว','Interacts with bones, joints, ligaments and muscles for support and movement.'],clinical:['การแตกหัก การเสื่อม หรือการจัดแนวผิดปกติอาจลดการรับแรงและการเคลื่อนไหว','Fracture, degeneration or malalignment can impair load bearing and movement.']},
  muscular:{location:['อยู่ในกลุ่มกล้ามเนื้อโครงร่างของบริเวณที่ระบุ','Located within a regional skeletal-muscle group.'],relations:['เกาะกับกระดูกหรือพังผืดและทำงานร่วมกับกล้ามเนื้อคู่ตรงข้ามเพื่อสร้างการเคลื่อนไหว','Attaches to bone or fascia and coordinates with opposing muscles to produce movement.'],clinical:['การบาดเจ็บหรือการอ่อนแรงอาจลดแรงและช่วงการเคลื่อนไหว','Injury or weakness can reduce force production and range of motion.']},
  integumentary:{location:['อยู่ที่ผิวภายนอกของร่างกายและชั้นเนื้อเยื่อใต้ผิว','Located at the body surface and its underlying tissue layers.'],relations:['เชื่อมต่อกับหลอดเลือด เส้นประสาท ต่อม และโครงสร้างขน/เล็บ','Interacts with vessels, nerves, glands, hair and nails.'],clinical:['การเสียหายของเกราะผิวหนังอาจเพิ่มการสูญเสียน้ำและความเสี่ยงต่อการติดเชื้อ','Loss of skin-barrier integrity can increase water loss and infection risk.']},
  sensory:{location:['อยู่ในอวัยวะรับความรู้สึกหรือเส้นทางประสาทรับความรู้สึก','Located in sensory organs or their neural pathways.'],relations:['เปลี่ยนสิ่งเร้าเป็นสัญญาณประสาทและส่งไปยังระบบประสาทส่วนกลาง','Converts stimuli into neural signals sent to the central nervous system.'],clinical:['ความผิดปกติอาจลดความสามารถในการมองเห็น ได้ยิน รับกลิ่น รับรส หรือรับสัมผัส','Disorders can impair vision, hearing, smell, taste or somatic sensation.']}
};

function regionFromY(y){
  if(y>=15)return ['ศีรษะและคอ','Head and neck'];
  if(y>=11)return ['ช่องอก','Thorax'];
  if(y>=8.3)return ['ช่องท้อง','Abdomen'];
  if(y>=6.4)return ['เชิงกราน','Pelvis'];
  if(y>=1)return ['แขนขาหรือส่วนลำตัวด้านล่าง','Limb or lower body region'];
  return ['ปลายแขนขา','Distal limb region'];
}

const bi=value=>Array.isArray(value)&&value.length===2?value:['',''];
const unique=list=>[...new Set(list.filter(Boolean))];

export function partSystems(part){
  return Array.isArray(part?.systems)&&part.systems.length?part.systems:[part?.system].filter(Boolean);
}

export function partHasSystem(part,systemId){
  return systemId==='all'||partSystems(part).includes(systemId);
}

export function teachingField(part,key){
  const value=part?.teaching?.[key];
  if(Array.isArray(value)&&value[0]&&value[1])return value;
  if(key==='function')return bi(part?.desc);
  return ['',''];
}

export function enrichAnatomyParts(parts){
  for(const part of parts){
    part.systems=unique([part.system,...(Array.isArray(part.systems)?part.systems:[]),...(secondarySystems[part.id]||[])]);
    const primary=part.systems[0]||part.system;
    const fallback=systemFallbacks[primary]||systemFallbacks.skeletal;
    const override=teachingOverrides[part.id]||{};
    const positionLocation=regionFromY(part.base?.y??9);
    const functionText=bi(part.desc);
    part.teaching={
      function:functionText,
      location:override.location||[`${positionLocation[0]} — ${fallback.location[0]}`,`${positionLocation[1]} — ${fallback.location[1]}`],
      relations:override.relations||fallback.relations,
      clinical:override.clinical||fallback.clinical
    };
    part.desc=functionText;
  }
  return parts;
}

export function validateAnatomyParts(parts,validSystemIds=[]){
  const errors=[];
  const seen=new Set();
  const valid=new Set(validSystemIds);
  for(const part of parts){
    if(!part?.id)errors.push('missing-id');
    else if(seen.has(part.id))errors.push(`duplicate-id:${part.id}`);
    else seen.add(part.id);
    if(!part?.th||!part?.en)errors.push(`missing-name:${part?.id||'unknown'}`);
    const list=partSystems(part);
    if(!list.length)errors.push(`missing-systems:${part?.id}`);
    for(const id of list)if(valid.size&&!valid.has(id))errors.push(`unknown-system:${part?.id}:${id}`);
    if(part.variant&&!['female','male'].includes(part.variant))errors.push(`invalid-variant:${part.id}:${part.variant}`);
    for(const key of ['function','location','relations','clinical']){
      const value=teachingField(part,key);
      if(!value[0]||!value[1])errors.push(`missing-${key}:${part.id}`);
    }
  }
  return errors;
}

export const multiSystemAssignments=Object.freeze({...secondarySystems});
