import { User, Department, Project, BudgetRequest, Notification, AnomalyLog } from './types';

// Departments
export const departments: Department[] = [
  { id: 'DEPT001', name: 'ฝ่ายวิชาการ (Academic)' },
  { id: 'DEPT002', name: 'ฝ่ายกิจการนักเรียน (Student Affairs)' },
  { id: 'DEPT003', name: 'ฝ่ายบริหารทั่วไป (General Admin)' },
  { id: 'DEPT004', name: 'ฝ่ายการเงินและพัสดุ (Finance & Procurement)' },
];

// Users
export const users: User[] = [
  // Admins (Finance/Procurement Officers)
  { id: 'U001', name: 'สมศรี มีทรัพย์', email: 'somsri@rajadhivas.ac.th', role: 'ADMIN', departmentId: 'DEPT004', avatar: 'https://picsum.photos/id/101/100/100' },
  { id: 'U002', name: 'วิชัย ใจดี', email: 'wichai@rajadhivas.ac.th', role: 'ADMIN', departmentId: 'DEPT004', avatar: 'https://picsum.photos/id/102/100/100' },
  
  // Department Users
  { id: 'U003', name: 'อาจารย์แดง วิชาการ', email: 'dang@rajadhivas.ac.th', role: 'USER_DEPARTMENT', departmentId: 'DEPT001', avatar: 'https://picsum.photos/id/103/100/100' },
  { id: 'U004', name: 'อาจารย์ดำ กีฬา', email: 'dum@rajadhivas.ac.th', role: 'USER_DEPARTMENT', departmentId: 'DEPT002', avatar: 'https://picsum.photos/id/104/100/100' },
  { id: 'U005', name: 'สมชาย ซ่อมบำรุง', email: 'somchai@rajadhivas.ac.th', role: 'USER_DEPARTMENT', departmentId: 'DEPT003', avatar: 'https://picsum.photos/id/105/100/100' },
  { id: 'U006', name: 'กานดา ภาษาไทย', email: 'kanda@rajadhivas.ac.th', role: 'USER_DEPARTMENT', departmentId: 'DEPT001', avatar: 'https://picsum.photos/id/106/100/100' },
  { id: 'U007', name: 'มานะ วิทยาศาสตร์', email: 'mana@rajadhivas.ac.th', role: 'USER_DEPARTMENT', departmentId: 'DEPT001', avatar: 'https://picsum.photos/id/107/100/100' },
  { id: 'U008', name: 'ปิติ ดนตรี', email: 'piti@rajadhivas.ac.th', role: 'USER_DEPARTMENT', departmentId: 'DEPT002', avatar: 'https://picsum.photos/id/108/100/100' },
];

// Projects
export const projects: Project[] = [
  { id: 'PJ001', name: 'โครงการวันวิทยาศาสตร์', budget: 50000, ownerDepartmentId: 'DEPT001' },
  { id: 'PJ002', name: 'โครงการกีฬาสีสัมพันธ์', budget: 120000, ownerDepartmentId: 'DEPT002' },
  { id: 'PJ003', name: 'ซ่อมแซมอาคารเรียน 3', budget: 200000, ownerDepartmentId: 'DEPT003' },
  { id: 'PJ004', name: 'จัดซื้อหนังสือเข้าห้องสมุด', budget: 30000, ownerDepartmentId: 'DEPT001' },
  { id: 'PJ005', name: 'อบรมพัฒนาบุคลากร', budget: 80000, ownerDepartmentId: 'DEPT003' },
  { id: 'PJ006', name: 'ค่ายลูกเสือ-เนตรนารี', budget: 150000, ownerDepartmentId: 'DEPT002' },
  { id: 'PJ007', name: 'ปรับปรุงระบบคอมพิวเตอร์', budget: 300000, ownerDepartmentId: 'DEPT003' },
  { id: 'PJ008', name: 'โครงการดนตรีในสวน', budget: 25000, ownerDepartmentId: 'DEPT002' },
];

// Initial Requests (Mocking Statuses)
export const initialRequests: BudgetRequest[] = [
  {
    id: 'REQ-2023-001',
    title: 'จัดซื้ออุปกรณ์ทดลองเคมี',
    projectId: 'PJ001',
    requesterId: 'U007',
    requesterName: 'มานะ วิทยาศาสตร์',
    departmentId: 'DEPT001',
    amount: 15000,
    status: 'COMPLETED',
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2023-09-15T14:00:00Z',
    description: 'ขออนุมัติซื้อสารเคมีและบีกเกอร์สำหรับการทดลอง ม.ปลาย',
    documents: ['ใบเสนอราคา_ร้านวิทย์.pdf', 'รายละเอียดโครงการ.pdf'],
    history: [
        { status: 'PROPOSED', date: '2023-09-01T10:00:00Z', actorName: 'มานะ วิทยาศาสตร์', action: 'เสนอเอกสาร' },
        { status: 'COMPLETED', date: '2023-09-15T14:00:00Z', actorName: 'สมศรี มีทรัพย์', action: 'อนุมัติจ่ายเงินเสร็จสิ้น' }
    ]
  },
  {
    id: 'REQ-2023-002',
    title: 'ค่าอาหารว่างวันวิทย์',
    projectId: 'PJ001',
    requesterId: 'U007',
    requesterName: 'มานะ วิทยาศาสตร์',
    departmentId: 'DEPT001',
    amount: 5000,
    status: 'PROPOSED',
    createdAt: '2023-10-25T09:00:00Z',
    updatedAt: '2023-10-25T09:00:00Z',
    description: 'ค่าอาหารว่างสำหรับวิทยากรและนักเรียนที่เข้าร่วม',
    documents: ['ประมาณการค่าใช้จ่าย.pdf'],
    history: [
        { status: 'PROPOSED', date: '2023-10-25T09:00:00Z', actorName: 'มานะ วิทยาศาสตร์', action: 'เสนอเอกสาร' }
    ]
  },
  {
    id: 'REQ-2023-003',
    title: 'ซ่อมแอร์ห้องพักครู',
    projectId: 'PJ003',
    requesterId: 'U005',
    requesterName: 'สมชาย ซ่อมบำรุง',
    departmentId: 'DEPT003',
    amount: 250000, // Suspicious: Over project budget (200,000)
    status: 'EXEC_REVIEW',
    createdAt: '2023-10-20T11:30:00Z',
    updatedAt: '2023-10-24T16:00:00Z',
    description: 'แอร์เสีย 5 ตัว ต้องเปลี่ยนคอมเพรสเซอร์ด่วน',
    documents: ['ใบเสนอราคา_แอร์เซอร์วิส.pdf'],
    history: [
        { status: 'PROPOSED', date: '2023-10-20T11:30:00Z', actorName: 'สมชาย ซ่อมบำรุง', action: 'เสนอเอกสาร' },
        { status: 'EXEC_REVIEW', date: '2023-10-24T16:00:00Z', actorName: 'สมศรี มีทรัพย์', action: 'เสนอผู้บริหาร' }
    ]
  },
  {
    id: 'REQ-2023-004',
    title: 'อุปกรณ์เชียร์ลีดเดอร์',
    projectId: 'PJ002',
    requesterId: 'U004',
    requesterName: 'อาจารย์ดำ กีฬา',
    departmentId: 'DEPT002',
    amount: 45000,
    status: 'RETURNED',
    createdAt: '2023-10-26T08:00:00Z',
    updatedAt: '2023-10-26T13:00:00Z',
    description: 'ซื้อชุดและอุปกรณ์ประกอบการเชียร์',
    documents: ['แบบชุด.pdf'],
    history: [
        { status: 'PROPOSED', date: '2023-10-26T08:00:00Z', actorName: 'อาจารย์ดำ กีฬา', action: 'เสนอเอกสาร' },
        { status: 'RETURNED', date: '2023-10-26T13:00:00Z', actorName: 'วิชัย ใจดี', action: 'ส่งคืนแก้ไข' }
    ],
    returnNote: {
        id: 'RET001',
        requestId: 'REQ-2023-004',
        adminName: 'วิชัย ใจดี',
        date: '2023-10-26T13:00:00Z',
        reasons: ['เอกสารไม่ครบถ้วน', 'รายละเอียดไม่ชัดเจน'],
        comment: 'กรุณาแนบใบสืบราคาจากร้านค้าอย่างน้อย 2 ร้านเปรียบเทียบกัน'
    }
  },
  {
    id: 'REQ-2023-005',
    title: 'ค่าเครื่องเสียงงานดนตรี',
    projectId: 'PJ008',
    requesterId: 'U008',
    requesterName: 'ปิติ ดนตรี',
    departmentId: 'DEPT002',
    amount: 12000,
    status: 'BUDGET_APPROVED',
    createdAt: '2023-10-27T10:00:00Z',
    updatedAt: '2023-10-28T09:00:00Z',
    description: 'เช่าเครื่องเสียงเพิ่มเติม',
    documents: [],
    history: []
  },
  {
    id: 'REQ-2023-006',
    title: 'วัสดุสำนักงาน',
    projectId: 'PJ005',
    requesterId: 'U005',
    requesterName: 'สมชาย ซ่อมบำรุง',
    departmentId: 'DEPT003',
    amount: 5000,
    status: 'PROPOSED', // Anomaly: Duplicate amount/requester/timing similar to another potential request
    createdAt: '2023-10-28T10:00:00Z',
    updatedAt: '2023-10-28T10:00:00Z',
    description: 'กระดาษ A4 และหมึกพิมพ์',
    documents: ['ใบเสร็จ.pdf'],
    history: []
  },
  {
    id: 'REQ-2023-007',
    title: 'วัสดุสำนักงาน (เพิ่มเติม)',
    projectId: 'PJ005',
    requesterId: 'U005',
    requesterName: 'สมชาย ซ่อมบำรุง',
    departmentId: 'DEPT003',
    amount: 5000,
    status: 'PROPOSED', // Duplicate detection target
    createdAt: '2023-10-28T10:05:00Z',
    updatedAt: '2023-10-28T10:05:00Z',
    description: 'กระดาษ A4 และหมึกพิมพ์ ล็อต 2',
    documents: ['ใบเสร็จ_2.pdf'],
    history: []
  }
];

export const notifications: Notification[] = [
  { id: 'N1', userId: 'U001', message: 'มีคำขออนุมัติใหม่จาก อาจารย์มานะ (วิทย์)', date: '2023-10-25T09:05:00Z', read: false, type: 'INFO' },
  { id: 'N2', userId: 'U004', message: 'คำขอ "อุปกรณ์เชียร์ลีดเดอร์" ถูกส่งคืนแก้ไข', date: '2023-10-26T13:05:00Z', read: false, type: 'WARNING' },
];

export const anomalies: AnomalyLog[] = [
    {
        id: 'AN001',
        requestId: 'REQ-2023-003',
        type: 'HIGH_COST',
        description: 'ยอดเงินขอเบิก (250,000) สูงกว่างบประมาณโครงการ (200,000)',
        severity: 'HIGH',
        detectedAt: '2023-10-20T11:31:00Z'
    },
    {
        id: 'AN002',
        requestId: 'REQ-2023-007',
        type: 'DUPLICATE_RECEIPT',
        description: 'พบคำขอซ้ำซ้อน: ยอดเงินและผู้ขอตรงกับ REQ-2023-006 ในเวลาใกล้เคียงกัน',
        severity: 'MEDIUM',
        detectedAt: '2023-10-28T10:06:00Z'
    }
];

export const returnReasons = [
    'เอกสารไม่ครบถ้วน',
    'ตัวเลขไม่ตรงกับงบประมาณ',
    'ขาดลายมือชื่อผู้รับผิดชอบ',
    'วันที่ในเอกสารไม่ถูกต้อง',
    'รายละเอียดโครงการไม่ชัดเจน',
    'ใบเสนอราคาหมดอายุ',
    'เบิกผิดหมวดรายจ่าย'
];
