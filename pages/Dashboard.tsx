import React from 'react';
import { useAppContext } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Clock, CheckCircle, Search } from 'lucide-react';
import { anomalies } from '../mockData';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { requests, currentUser } = useAppContext();

  // Calculate stats
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status !== 'COMPLETED' && r.status !== 'RETURNED').length;
  const completedRequests = requests.filter(r => r.status === 'COMPLETED').length;
  const returnedRequests = requests.filter(r => r.status === 'RETURNED').length;

  const totalBudget = requests.reduce((acc, curr) => acc + curr.amount, 0);

  // Data for Charts
  const statusData = [
    { name: 'รออนุมัติ/ดำเนินการ', value: pendingRequests, color: '#3b82f6' },
    { name: 'เสร็จสิ้น', value: completedRequests, color: '#10b981' },
    { name: 'แก้ไข', value: returnedRequests, color: '#ef4444' },
  ];

  // AI Anomaly Detection Logic (Simple visual representation of mock data)
  // In a real app, this would query an endpoint
  const relevantAnomalies = currentUser?.role === 'ADMIN' 
    ? anomalies 
    : anomalies.filter(a => {
        const req = requests.find(r => r.id === a.requestId);
        return req?.requesterId === currentUser?.id;
    });

  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          ยินดีต้อนรับ, <span className="text-pink-600">{currentUser?.name}</span>
        </h1>
        <p className="text-slate-500">ภาพรวมการใช้งบประมาณและเอกสาร</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="คำขอทั้งหมด" 
          value={totalRequests} 
          icon={TrendingUp} 
          color="bg-blue-500" 
          subtext="รายการในปีงบประมาณนี้"
        />
        <StatCard 
          title="รออนุมัติ/ดำเนินการ" 
          value={pendingRequests} 
          icon={Clock} 
          color="bg-amber-500" 
          subtext="ต้องจัดการ"
        />
        <StatCard 
          title="เสร็จสิ้น" 
          value={completedRequests} 
          icon={CheckCircle} 
          color="bg-green-500" 
          subtext="เบิกจ่ายเรียบร้อย"
        />
        <StatCard 
          title="งบประมาณรวม" 
          value={`฿${totalBudget.toLocaleString()}`} 
          icon={AlertTriangle} 
          color="bg-pink-500" 
          subtext="ยอดรวมทุกรายการ"
        />
      </div>

      {/* AI Anomaly Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: AI Alerts */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                    <div className="flex items-center space-x-2">
                        <Search className="text-pink-400" size={20} />
                        <h3 className="font-semibold">AI Audit & Anomaly Detection</h3>
                    </div>
                    <span className="text-xs bg-pink-600 px-2 py-1 rounded text-white">
                        {relevantAnomalies.length} ความผิดปกติที่ตรวจพบ
                    </span>
                </div>
                <div className="p-5">
                    {relevantAnomalies.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
                            ไม่พบความผิดปกติในระบบ
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {relevantAnomalies.map(anomaly => (
                                <div key={anomaly.id} className="flex items-start space-x-4 p-4 rounded-lg border border-slate-100 bg-red-50/50 hover:bg-red-50 transition-colors">
                                    <div className="shrink-0 mt-1">
                                        <AlertTriangle className="text-red-500" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-red-900 text-sm">{anomaly.type.replace('_', ' ')}</h4>
                                            <span className="text-xs text-slate-400">
                                                {new Date(anomaly.detectedAt).toLocaleDateString('th-TH')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-red-700 mt-1">{anomaly.description}</p>
                                        <div className="mt-2">
                                            <Link to={`/requests/${anomaly.requestId}`} className="text-xs font-medium text-blue-600 hover:underline">
                                                ตรวจสอบ Request {anomaly.requestId}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity placeholder (optional) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">สถานะคำขอล่าสุด</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">หัวข้อ</th>
                                <th className="px-4 py-3">ผู้ขอ</th>
                                <th className="px-4 py-3">ยอดเงิน</th>
                                <th className="px-4 py-3 rounded-r-lg">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {requests.slice(0, 5).map(req => (
                                <tr key={req.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-800">
                                        <Link to={`/requests/${req.id}`} className="hover:text-pink-600">
                                            {req.title}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{req.requesterName}</td>
                                    <td className="px-4 py-3 text-slate-600">฿{req.amount.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                            req.status === 'COMPLETED' ? 'bg-green-500' : 
                                            req.status === 'RETURNED' ? 'bg-red-500' : 'bg-blue-500'
                                        }`}></span>
                                        {req.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Right: Charts */}
        <div className="space-y-6">
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-semibold text-slate-800 mb-4 text-center">สัดส่วนสถานะเอกสาร</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                    {statusData.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-slate-600">{item.name}</span>
                            </div>
                            <span className="font-bold text-slate-800">{item.value}</span>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
