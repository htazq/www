import React from 'react';
import { Server, Network, Box, TrendingUp, Cpu, Shield } from 'lucide-react';

const skills = [
  { name: "Linux Kernel", icon: <Server className="text-emerald-400" />, desc: "内核调优 & 底层机制研究" },
  { name: "Kubernetes", icon: <Box className="text-blue-400" />, desc: "集群编排、Helm 封装与 Operator 开发" },
  { name: "Networking", icon: <Network className="text-orange-400" />, desc: "BGP 路由, SDN 架构, eBPF 观测" },
  { name: "Quant Trading", icon: <TrendingUp className="text-purple-400" />, desc: "量化策略研发 & 高频回测系统" },
  { name: "Infrastructure", icon: <Cpu className="text-cyan-400" />, desc: "IaC 基础设施代码化 (Terraform/Ansible)" },
  { name: "Security", icon: <Shield className="text-red-400" />, desc: "网络攻防、系统加固与安全审计" },
];

export const SkillMatrix: React.FC = () => {
  return (
    <div className="py-20 px-4 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-12 flex items-center">
        <span className="text-emerald-500 mr-2 font-mono">01.</span> 系统能力矩阵 (SYSTEM CAPABILITIES)
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, idx) => (
          <div 
            key={idx}
            className="group relative bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-mono text-emerald-500">INIT_OK</span>
            </div>
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
              {skill.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{skill.name}</h3>
            <p className="text-slate-400 text-sm">{skill.desc}</p>
            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 w-[85%]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};