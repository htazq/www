import React, { useState, useEffect } from 'react';
import { Terminal } from './Terminal';
import { Activity, Server, Cpu, HardDrive, Wifi, Globe, AlertTriangle, CheckCircle } from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: React.ReactNode;
}

interface NodeStatus {
  name: string;
  status: 'Ready' | 'NotReady' | 'Warning';
  pods: { running: number; pending: number; failed: number };
  cpu: number;
  memory: number;
  ip: string;
}

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  source: string;
  message: string;
}

export const SystemMonitor: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [nodeStatus, setNodeStatus] = useState<NodeStatus[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'nodes' | 'logs'>('overview');

  // 模拟系统指标数据
  useEffect(() => {
    const generateMetrics = () => {
      return [
        {
          name: 'CPU Usage',
          value: Math.floor(Math.random() * 30) + 20,
          max: 100,
          unit: '%',
          status: 'normal' as const,
          icon: <Cpu className="w-4 h-4" />
        },
        {
          name: 'Memory',
          value: Math.floor(Math.random() * 40) + 30,
          max: 100,
          unit: '%',
          status: 'normal' as const,
          icon: <Server className="w-4 h-4" />
        },
        {
          name: 'Disk I/O',
          value: Math.floor(Math.random() * 60) + 10,
          max: 100,
          unit: 'MB/s',
          status: 'normal' as const,
          icon: <HardDrive className="w-4 h-4" />
        },
        {
          name: 'Network',
          value: Math.floor(Math.random() * 50) + 20,
          max: 100,
          unit: 'Mbps',
          status: 'normal' as const,
          icon: <Wifi className="w-4 h-4" />
        },
        {
          name: 'Cluster Load',
          value: Math.floor(Math.random() * 20) + 5,
          max: 100,
          unit: '%',
          status: 'normal' as const,
          icon: <Activity className="w-4 h-4" />
        },
        {
          name: 'Request Rate',
          value: Math.floor(Math.random() * 500) + 200,
          max: 1000,
          unit: 'req/s',
          status: 'normal' as const,
          icon: <Globe className="w-4 h-4" />
        }
      ];
    };

    setSystemMetrics(generateMetrics());

    const interval = setInterval(() => {
      setSystemMetrics(generateMetrics());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 模拟节点状态数据
  useEffect(() => {
    const generateNodeStatus = (): NodeStatus[] => {
      const statuses = ['Ready' as const, 'Ready' as const, 'Ready' as const, 'Warning' as const, 'NotReady' as const];
      return statuses.map((status, idx) => ({
        name: `node-${idx + 1}.at9.net`,
        status,
        pods: {
          running: Math.floor(Math.random() * 20) + 5,
          pending: Math.floor(Math.random() * 3),
          failed: Math.floor(Math.random() * 2)
        },
        cpu: Math.floor(Math.random() * 60) + 20,
        memory: Math.floor(Math.random() * 70) + 20,
        ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      }));
    };

    setNodeStatus(generateNodeStatus());

    const interval = setInterval(() => {
      setNodeStatus(generateNodeStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 模拟日志流
  useEffect(() => {
    const logSources = ['nginx-ingress', 'kube-proxy', 'coredns', 'etcd', 'api-server'];
    const logLevels = ['INFO' as const, 'WARN' as const, 'ERROR' as const];
    const logMessages = [
      'Connection established to upstream server',
      'Health check passed for service endpoint',
      'Pod restart detected, container recovery in progress',
      'SSL certificate renewal completed successfully',
      'Rate limit threshold reached for client IP',
      'Configuration reload triggered by hot-reload',
      'Disk space warning: usage at 87%',
      'New deployment rollout initiated',
      'Service discovery registration successful',
      'Network policy applied to namespace'
    ];

    const generateLogEntry = (): LogEntry => {
      const now = new Date();
      return {
        timestamp: now.toISOString(),
        level: logLevels[Math.floor(Math.random() * logLevels.length)],
        source: logSources[Math.floor(Math.random() * logSources.length)],
        message: logMessages[Math.floor(Math.random() * logMessages.length)]
      };
    };

    const initialLogs = Array(10).fill(null).map(() => generateLogEntry());
    setLogs(initialLogs);

    const interval = setInterval(() => {
      setLogs(prevLogs => {
        const newLog = generateLogEntry();
        return [newLog, ...prevLogs.slice(0, 19)];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: 'normal' | 'warning' | 'critical' | 'Ready' | 'NotReady' | 'Warning') => {
    if (status === 'normal' || status === 'Ready') return 'text-emerald-400';
    if (status === 'warning' || status === 'Warning') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLogColor = (level: 'INFO' | 'WARN' | 'ERROR') => {
    if (level === 'INFO') return 'text-emerald-400';
    if (level === 'WARN') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (value: number) => {
    if (value < 60) return 'bg-emerald-500';
    if (value < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="py-20 px-4 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 flex items-center">
        <span className="text-emerald-500 mr-2 font-mono">02.</span> 系统监控仪表板 // SYSTEM MONITOR
      </h2>
      <p className="text-slate-400 mb-12 max-w-2xl">
        实时集群监控：资源使用情况、节点状态、服务健康度与系统日志流，全方位展示云原生基础设施运行状态。
      </p>

      <Terminal title="root@at9:~/cluster/monitor.sh">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 border-b border-slate-700">
          {(['overview', 'nodes', 'logs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                selectedTab === tab
                  ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'overview' && '概览 (Overview)'}
              {tab === 'nodes' && '节点 (Nodes)'}
              {tab === 'logs' && '日志 (Logs)'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemMetrics.map((metric, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${metric.status === 'normal' ? 'bg-emerald-900/30' : metric.status === 'warning' ? 'bg-yellow-900/30' : 'bg-red-900/30'}`}>
                      <div className={getStatusColor(metric.status)}>
                        {metric.icon}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-300">{metric.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xl font-bold text-white">{metric.value}</span>
                    <span className="text-xs text-slate-500">{metric.unit}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${getProgressBarColor(metric.value)}`}
                    style={{ width: `${(metric.value / metric.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nodes Tab */}
        {selectedTab === 'nodes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-700">
                  <th className="pb-3 text-slate-400 font-mono">NODE NAME</th>
                  <th className="pb-3 text-slate-400 font-mono">STATUS</th>
                  <th className="pb-3 text-slate-400 font-mono">PODS (R/P/F)</th>
                  <th className="pb-3 text-slate-400 font-mono">CPU</th>
                  <th className="pb-3 text-slate-400 font-mono">MEMORY</th>
                  <th className="pb-3 text-slate-400 font-mono">IP</th>
                </tr>
              </thead>
              <tbody>
                {nodeStatus.map((node, idx) => (
                  <tr key={idx} className="border-b border-slate-800/50">
                    <td className="py-3 text-white font-mono">{node.name}</td>
                    <td className="py-3">
                      <div className={`flex items-center space-x-1 ${getStatusColor(node.status)}`}>
                        {node.status === 'Ready' && <CheckCircle className="w-4 h-4" />}
                        {node.status === 'Warning' && <AlertTriangle className="w-4 h-4" />}
                        {node.status === 'NotReady' && <AlertTriangle className="w-4 h-4" />}
                        <span className="font-mono">{node.status}</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-slate-300">
                      {node.pods.running}/{node.pods.pending}/{node.pods.failed}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressBarColor(node.cpu)}`}
                            style={{ width: `${node.cpu}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-slate-300 text-xs">{node.cpu}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressBarColor(node.memory)}`}
                            style={{ width: `${node.memory}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-slate-300 text-xs">{node.memory}%</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-slate-300">{node.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Logs Tab */}
        {selectedTab === 'logs' && (
          <div className="space-y-2 font-mono text-sm">
            {logs.map((log, idx) => (
              <div key={idx} className="flex space-x-3 pb-2 border-b border-slate-800/30">
                <span className="text-slate-600 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className={`whitespace-nowrap font-bold ${getLogColor(log.level)}`}>[{log.level}]</span>
                <span className="text-slate-400 whitespace-nowrap">{log.source}:</span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </Terminal>
    </div>
  );
};