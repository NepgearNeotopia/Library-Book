const books = [
  // ---------- Textbook: Science (10) ----------
  {
    id: 1,
    title: 'วิทยาศาสตร์ ม.1 เคมือพื้นฐาน',
    author: 'สมชาย วิทยาศิริ',
    type: 'textbook',
    category: 'science',
    description: 'หนังสือเรียนวิทยาศาสตร์ระดับชั้นมัธยมศึกษาตอนต้น เรียนรู้เรื่องสิ่งมีชีวิต สารและพลังงาน',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 5
  },
  {
    id: 2,
    title: 'วิทยาศาสตร์ ม.2 สิ่งมีชีวิตและสิ่งแวดล้อม',
    author: 'สุดา ธนากร',
    type: 'textbook',
    category: 'science',
    description: 'เรียนรู้ความหลากหลายของสิ่งมีชีวิต ความสัมพันธ์ระหว่างสิ่งมีชีวิตกับสิ่งแวดล้อม',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 4
  },
  {
    id: 3,
    title: 'วิทยาศาสตร์ ม.3 พลังงานและการเคลื่อนที่',
    author: 'ประเสริฐ กิจจานุ',
    type: 'textbook',
    category: 'science',
    description: 'ตำราหลักวิทยาศาสตร์ระดับมัธยมศึกษาตอนปลาย เน้นแรงพลังงาน ความเคลื่อนที่ และคลื่น',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 3
  },
  {
    id: 4,
    title: 'วิทยาศาสตร์ ม.4 เคมีพื้นฐาน',
    author: 'วิชัย เสถียรภาพ',
    type: 'textbook',
    category: 'science',
    description: 'เรียนรู้เคมีพื้นฐาน โครงสร้างอะตอม ตารางธาตุ และพันธะเคมี',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 5
  },
  {
    id: 5,
    title: 'วิทยาศาสตร์ ม.5 ชีววิทยา',
    author: 'นิรันด์ พงษ์ไพบูลย์',
    type: 'textbook',
    category: 'science',
    description: 'หนังสือชีววิทยาระดับชั้นมัธยมศึกษาตอนปลาย ครอบคลุมเซลล์ พันธุกรรม และระบบอวัยวะ',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 6
  },
  {
    id: 6,
    title: 'วิทยาศาสตร์ ม.6 ฟิสิกส์',
    author: 'ธนากร ศรีสุวรรณ',
    type: 'textbook',
    category: 'science',
    description: 'หนังสือฟิสิกส์ระดับชั้นมัธยมศึกษาตอนปลาย เน้นกลศาสตร์ แสง เสียง และไฟฟ้า',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 4
  },
  {
    id: 7,
    title: 'วิทยาศาสตร์กับเทคโนโลยีในชีวิตประจำวัน',
    author: 'มนตรี อินทรา',
    type: 'textbook',
    category: 'science',
    description: 'เชื่อมโยงความรู้ทางวิทยาศาสตร์เข้ากับเทคโนโลยีที่พบในชีวิตประจำวัน',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 3
  },
  {
    id: 8,
    title: 'ดาราศาสตร์สำหรับผู้เริ่มต้น',
    author: 'จันทร์แสง วรวรรณ',
    type: 'textbook',
    category: 'science',
    description: 'แนะนำระบบสุริยะ ดาวเคราะห์ และการสังเกตการณ์ท้องฟ้า',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 2
  },
  {
    id: 9,
    title: 'นิเวศวิทยาเบื้องต้น',
    author: 'บุญมี เกียรติศักดิ์',
    type: 'textbook',
    category: 'science',
    description: 'ศึกษาความสัมพันธ์ของสิ่งมีชีวิตกับสิ่งแวดล้อมทางชีวภาพ',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 4
  },
  {
    id: 10,
    title: 'วิทยาศาสตร์สิ่งแวดล้อมและพลังงานทดแทน',
    author: 'สุรชัย ทองดี',
    type: 'textbook',
    category: 'science',
    description: 'เรียนรู้เรื่องสิ่งแวดล้อม การอนุรักษ์ และพลังงานทางเลือก',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 5
  },

  // ---------- Textbook: Math (10) ----------
  {
    id: 11,
    title: 'คณิตศาสตร์ ม.1',
    author: 'ชาญชัย พิพัฒน์ศิลป์',
    type: 'textbook',
    category: 'math',
    description: 'หนังสือคณิตศาสตร์ชั้นมัธยมศึกษาตอนต้น บทเริ่มต้นเลขจำนวนและพีชคณิต',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 5
  },
  {
    id: 12,
    title: 'คณิตศาสตร์ ม.2',
    author: 'เจษฎา โกมลศักดิ์',
    type: 'textbook',
    category: 'math',
    description: 'เรียนรู้เลขจำนวนเชิงซ้อน พีชคณิต และสมการเชิงเส้น',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 4
  },
  {
    id: 13,
    title: 'คณิตศาสตร์ ม.3',
    author: 'วีระ มั่นคง',
    type: 'textbook',
    category: 'math',
    description: 'เรียนพีชคณิต เลขคณิต และสถิติพื้นฐานสำหรับชั้นมัธยมศึกษาตอนปลาย',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 6
  },
  {
    id: 14,
    title: 'คณิตศาสตร์ ม.4 เลขคณิตชั้นสูง',
    author: 'ปรีชา ตั้งธนาคาร',
    type: 'textbook',
    category: 'math',
    description: 'หนังสือเลขคณิตระดับชั้นมัธยมศึกษาตอนปลาย เรื่องเซต ตรรกะ และฟังก์ชัน',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 5
  },
  {
    id: 15,
    title: 'คณิตศาสตร์ ม.5 แคลคูลัส',
    author: 'อนุชา วงศ์สวัสดิ์',
    type: 'textbook',
    category: 'math',
    description: 'เรียนรู้แคลคูลัส ลิมิต อนุพันธ์ และอินทิเกรต',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 3
  },
  {
    id: 16,
    title: 'คณิตศาสตร์ ม.6 เวกเตอร์',
    author: 'สมพร อินทร์เจริญ',
    type: 'textbook',
    category: 'math',
    description: 'เน้นทฤษฎีบทเวกเตอร์ พีชคณิตเชิงเรขาคณิต และความน่าจะเป็น',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 4
  },
  {
    id: 17,
    title: 'พีชคณิตเพื่อการสอบ',
    author: 'ศิริพร พานิชย์',
    type: 'textbook',
    category: 'math',
    description: 'ตำราสรุปสูตรและเทคนิคแก้โจทย์พีชคณิตสำหรับเตรียมสอบ',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 7
  },
  {
    id: 18,
    title: 'คณิตศาสตร์สูตรครอบจักรวาล',
    author: 'ธีรพล ก้องเกียรติ',
    type: 'textbook',
    category: 'math',
    description: 'สรุปสูตรคณิตศาสตร์ทุกหมวดพร้อมตัวอย่างโจทย์',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 6
  },
  {
    id: 19,
    title: 'สถิติและการวิเคราะห์ข้อมูลเบื้องต้น',
    author: 'นัทธิพล แสงทอง',
    type: 'textbook',
    category: 'math',
    description: 'การเก็บรวบรวมข้อมูล การแปลงความหมาย และการวิเคราะห์เชิงสถิติ',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 3
  },
  {
    id: 20,
    title: 'คณิตศาสตร์เชิงพีชคณิตสำหรับมัธยมศึกษา',
    author: 'มานพ อินทรานุ',
    type: 'textbook',
    category: 'math',
    description: 'หนังสือเสริมทักษะพีชคณิตสำหรับนักเรียนที่ต้องการพื้นฐานที่แข็งแรง',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 5
  },

  // ---------- Textbook: Thai (10) ----------
  {
    id: 21,
    title: 'ภาษาไทย ม.1',
    author: 'สุดารา บุญมาก',
    type: 'textbook',
    category: 'thai',
    description: 'หนังสือภาษาไทยระดับชั้นมัธยมศึกษาตอนต้น บทนำแนะนำตัวเองและการสื่อสาร',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 6
  },
  {
    id: 22,
    title: 'ภาษาไทย ม.2',
    author: 'ณัฐพล รัตนวงศ์',
    type: 'textbook',
    category: 'thai',
    description: 'เรียนรู้การใช้ภาษาไทยเพื่อสื่อสารในชีวิตประจำวันและการแต่งเรื่อง',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 5
  },
  {
    id: 23,
    title: 'ภาษาไทย ม.3',
    author: 'พิมพ์ชนก วงศ์สวัสดิ์',
    type: 'textbook',
    category: 'thai',
    description: 'ฝึกการอ่านเข้าใจ การวิเคราะห์เรื่อง และการใช้ภาษาไทยอย่างถูกต้อง',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 4
  },
  {
    id: 24,
    title: 'ภาษาไทย ม.4',
    author: 'อรรถ เจริญชัย',
    type: 'textbook',
    category: 'thai',
    description: 'หนังสือภาษาไทยระดับชั้นมัธยมศึกษาตอนปลาย เรื่องรูปพยัญชนะและการสร้างอรรถศาสตร์',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 4
  },
  {
    id: 25,
    title: 'ภาษาไทย ม.5',
    author: 'คุณภา วัฒนกิจ',
    type: 'textbook',
    category: 'thai',
    description: 'เรียนรู้การแต่งเรื่อง โคลง ร้อยกรอง และแนวคิดเชิงวรรณกรรม',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 3
  },
  {
    id: 26,
    title: 'ภาษาไทย ม.6',
    author: 'รัตนา ศรีสุวรรณ',
    type: 'textbook',
    category: 'thai',
    description: 'ศึกษาบทประพันธ์ไทย แนวคิด และการวิจารณ์งานวรรณกรรม',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 5
  },
  {
    id: 27,
    title: 'หลักภาษาไทย',
    author: 'บุญเกิด ใจดี',
    type: 'textbook',
    category: 'thai',
    description: 'หนังสือภาษาไทยรวมเนื้อหาตั้งแต่ระดับประถมศึกษาจนถึงมัธยมศึกษา',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 6
  },
  {
    id: 28,
    title: 'การเขียนสะกดและการแปลภาษาไทย',
    author: 'เจษฎา วงศ์ไทย',
    type: 'textbook',
    category: 'thai',
    description: 'แนวทางการเขียนสะกดภาษาไทยให้ถูกต้องและการแปลภาษาอังกฤษ',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 4
  },
  {
    id: 29,
    title: 'วรรณกรรมไทยร่วมสมัย',
    author: 'ชัยพร สุวรรณภูมิ',
    type: 'textbook',
    category: 'thai',
    description: 'ศึกษางานวรรณกรรมไทยร่วมสมัยและแนวคิดสำคัญของยุคปัจจุบัน',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 3
  },
  {
    id: 30,
    title: 'การเขียนงานภาษาไทยเพื่อการสื่อสาร',
    author: 'มณีรัตน์ ชัยวัฒน์',
    type: 'textbook',
    category: 'thai',
    description: 'ฝึกเขียนงานภาษาไทยที่ถูกต้อง เป็นธรรมชาติ และสื่อความหมายได้ครบถ้วน',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 4
  },

  // ---------- Comic: Fantasy (7) ----------
  {
    id: 31,
    title: 'เมืองมังกรพันธ์',
    author: 'เกียรติศักดิ์ พงษ์ทอง',
    type: 'comic',
    category: 'fantasy',
    description: 'เรื่องราวการผจญภัยเพื่อพิทักษ์เมืองมังกรในโลกแฟนตาซี',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 8
  },
  {
    id: 32,
    title: 'อาณาจักรเวทมนตร์',
    author: 'ปรีดา จันทร์เพ็ญ',
    type: 'comic',
    category: 'fantasy',
    description: 'ภาพการ์ตูนแฟนตาซีเรื่องราวของเวทมนตร์ที่ต้องร่วมกันประกอบพลัง',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 7
  },
  {
    id: 33,
    title: 'ตำนานเทพเจ้า',
    author: 'ธนากร ศรีไพศาล',
    type: 'comic',
    category: 'fantasy',
    description: 'เรื่องเล่าตำนานเทพเจ้าที่เกิดขึ้นในดินแดนตำนาน',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 6
  },
  {
    id: 34,
    title: 'นักรบผู้พลังมังกร',
    author: 'วีรภัย สง่างาม',
    type: 'comic',
    category: 'fantasy',
    description: 'ภาพการ์ตูนแฟนตาซีแนวพาผจญภัยของเด็กหนุ่มที่ได้พลังมังกร',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 9
  },
  {
    id: 35,
    title: 'มิติทิพย์',
    author: 'อาทิตย์ วรฤทธิ์',
    type: 'comic',
    category: 'fantasy',
    description: 'เรื่องราวการผจญภัยเข้าสู่มิติทิพย์ที่เปิดประตูสู่โลกอีกฝั่ง',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 5
  },
  {
    id: 36,
    title: 'ความฝันที่มีชีวิต',
    author: 'ณัฐพงศ์ ศิริพงษ์',
    type: 'comic',
    category: 'fantasy',
    description: 'ภาพการ์ตูนเรื่องราวที่ความฝันของทุกคนมีชีวิตและต่อสู้เพื่อคงอยู่',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 4
  },
  {
    id: 37,
    title: 'ราชันทีแห่งพฤกษ์',
    author: 'กิตติศักดิ์ พิพัฒน์',
    type: 'comic',
    category: 'fantasy',
    description: 'เรื่องเล่าแฟนตาซีแนวเทพเจ้าเรื่องราชันทีแห่งพฤกษ์',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 6
  },

  // ---------- Comic: Romantic (7) ----------
  {
    id: 38,
    title: 'รักที่มั่นคง',
    author: 'ศิรินภา รัตนา',
    type: 'comic',
    category: 'romantic',
    description: 'ภาพการ์ตูนโรแมนติกเรื่องราวความรักที่ผ่านการทดสอบ',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 10
  },
  {
    id: 39,
    title: 'รักเริ่มต้นที่สถานีฝน',
    author: 'ปณิธาน รักษ์ศรี',
    type: 'comic',
    category: 'romantic',
    description: 'เรื่องราวโรแมนติกที่เริ่มต้นในสถานีรถไฟฟ้าในวันฝนตก',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 8
  },
  {
    id: 40,
    title: 'แฟนตามกรรมเก่า',
    author: 'นภาพร วัฒนกิจ',
    type: 'comic',
    category: 'romantic',
    description: 'ภาพการ์ตูนโรแมนติกยุคใหม่เรื่องความรักที่เปลี่ยนไปตามยุคสมัย',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 7
  },
  {
    id: 41,
    title: 'หัวใจในฤดูฝน',
    author: 'ภาณุพงษ์ สุริยะ',
    type: 'comic',
    category: 'romantic',
    description: 'เรื่องเล่าความรักอันอ่อนโยนในบรรยากาศฤดูฝน',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 6
  },
  {
    id: 42,
    title: 'รักข้ามเวลา',
    author: 'วิชัย พงษ์เลิศ',
    type: 'comic',
    category: 'romantic',
    description: 'ภาพการ์ตูนเรื่องความรักที่ข้ามผ่านกาลเวลาและหน่วยความจำ',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 5
  },
  {
    id: 43,
    title: 'เดินทางสู่ใจเธอ',
    author: 'อรนันท์ จันทร์แสง',
    type: 'comic',
    category: 'romantic',
    description: 'เรื่องราวการเดินทางไปหาและทำความรู้จักกับคนที่ใช่',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 4
  },
  {
    id: 44,
    title: 'แฟนเก่าแฟนใหม่',
    author: 'กาญจนา พิทักษ์',
    type: 'comic',
    category: 'romantic',
    description: 'ภาพการ์ตูนโรแมนติกแนววางกินเรื่องราวรักที่เปลี่ยนไป',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 7
  },

  // ---------- Comic: Mystery (6) ----------
  {
    id: 45,
    title: 'คดีปริศนาห้องเก็บหนังสือ',
    author: 'สมพล ชัยชนะ',
    type: 'comic',
    category: 'mystery',
    description: 'ภาพการ์ตูนสืบสวนเรื่องการหายตัวของต้นหนังสือระดับตำนาน',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 5
  },
  {
    id: 46,
    title: 'นักสืบคดีเงาอาถา',
    author: 'วีระ ทองประเสริฐ',
    type: 'comic',
    category: 'mystery',
    description: 'เรื่องสืบสวนคดีลึกลับในห้องสมุดที่เกิดเหตุการณ์แปลกประหลาด',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 4
  },
  {
    id: 47,
    title: 'ร่องรอยแห่งความลับ',
    author: 'ประสิทธิ์ พงษ์ศิลป์',
    type: 'comic',
    category: 'mystery',
    description: 'ภาพการ์ตูนแนวสืบสวนเรื่องตามหาความจริงเบื้องหลังร่องรอยที่หายไป',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 6
  },
  {
    id: 48,
    title: 'ความลึกลับของตำรับห้าม',
    author: 'ธีรศักดิ์ สุขใจ',
    type: 'comic',
    category: 'mystery',
    description: 'เรื่องสืบสวนคดีตำรับต้องห้ามที่เปลี่ยนไปเมื่อเปิดหนังสือเล่มเก่า',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 3
  },
  {
    id: 49,
    title: 'ปริศนาห้องเสียง',
    author: 'กฤษณ์ วัฒนากร',
    type: 'comic',
    category: 'mystery',
    description: 'ภาพการ์ตูนสืบสวนเรื่องเสียงประหลาดที่ดังขึ้นในห้องสมุด',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'borrowed',
    quantity: 5
  },
  {
    id: 50,
    title: 'ไฟล์ลับที่ไม่ควรเปิด',
    author: 'อรุณ มณีรัตน์',
    type: 'comic',
    category: 'mystery',
    description: 'เรื่องสืบสวนคดีเก่าที่เปิดไฟล์ลับขึ้นมาแล้วทุกอย่างเปลี่ยนไป',
    coverImage: '/assets/images/book-placeholder.jpg',
    status: 'available',
    quantity: 4
  }
];

module.exports = books;
