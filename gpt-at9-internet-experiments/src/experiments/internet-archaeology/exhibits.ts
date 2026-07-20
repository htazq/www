export type ExhibitCategory =
  'protocol' | 'community' | 'media' | 'virtualization' | 'infrastructure' | 'intelligence';

export const categoryNames: Record<ExhibitCategory, string> = {
  protocol: '协议',
  community: '社区',
  media: '媒体',
  virtualization: '虚拟化',
  infrastructure: '基础设施',
  intelligence: '智能',
};

export interface Exhibit {
  id: string;
  name: string;
  era: string;
  year: number;
  category: ExhibitCategory;
  definition: string;
  interface: string;
  uses: string;
  problem: string;
  limits: string;
  future: string;
  legacy: string;
  demo:
    | 'terminal'
    | 'ftp'
    | 'bbs'
    | 'player'
    | 'flash'
    | 'rss'
    | 'irc'
    | 'vm'
    | 'layers'
    | 'scheduler'
    | 'tokens'
    | 'agent';
}

export const exhibits: Exhibit[] = [
  {
    id: 'telnet',
    name: 'Telnet',
    era: '1970s–1980s',
    year: 1971,
    category: 'protocol',
    definition: '一种明文远程终端协议。',
    interface: '单色命令行与即时的字符回显。',
    uses: '远程管理、网络设备、大学系统。',
    problem: '让远方的计算机感觉就像在本地操作。',
    limits: '没有加密；凭据与内容都以明文传输。',
    future: '人们想象过对共享计算的普遍远程访问。',
    legacy: '它的交互模型活在 SSH 与网页终端里。',
    demo: 'terminal',
  },
  {
    id: 'ftp',
    name: 'FTP',
    era: '1970s–1990s',
    year: 1973,
    category: 'protocol',
    definition: '一种列目录与传文件的协议。',
    interface: '双栏界面、目录树、传输队列与状态码。',
    uses: '软件分发、网站发布、科研数据集。',
    problem: '在互不兼容的机器与网络之间搬运文件。',
    limits: '控制与数据通道分离、防火墙不友好、默认安全性弱。',
    future: '每一个档案库都可以远程浏览。',
    legacy: '传输语义活在 SFTP、对象存储与同步工具里。',
    demo: 'ftp',
  },
  {
    id: 'bbs',
    name: 'BBS 电子布告栏',
    era: '1980s–1990s',
    year: 1978,
    category: 'community',
    definition: '拨号或联网的电子布告栏社区。',
    interface: '编号文本菜单、话题列表、昵称与帖子串。',
    uses: '本地社区、文件交换、技术支持、游戏。',
    problem: '在商业互联网出现之前把人连接起来。',
    limits: '调制解调器很慢、单线系统、覆盖本地化、身份割裂。',
    future: '由本地站点拼成一个全球公共广场。',
    legacy: '论坛、楼层评论、版主角色与网络昵称。',
    demo: 'bbs',
  },
  {
    id: 'winamp',
    name: 'Winamp 时代播放器',
    era: '1990s 末',
    year: 1997,
    category: 'media',
    definition: '为个人数字音乐而生的紧凑桌面界面。',
    interface: '密集的按钮、均衡器、播放列表与自定义视觉语言。',
    uses: 'MP3 曲库、播放列表、桌面听歌。',
    problem: '把下载来的音频文件变成个人的广播电台。',
    limits: '本地文件、元数据混乱、设备同步有限。',
    future: '每个听众都能编排自己永不落幕的电台。',
    legacy: '播放队列、皮肤、可视化效果与个人媒体库。',
    demo: 'player',
  },
  {
    id: 'flash',
    name: 'Flash 时代网页',
    era: '1990s 末–2000s',
    year: 1996,
    category: 'media',
    definition: '浏览器里的矢量动画与交互媒体运行时。',
    interface: '会动的导航、矢量场景、嵌入式游戏与片头。',
    uses: '游戏、教育、广告、实验性网站、视频播放器。',
    problem: '在浏览器原生 API 成熟之前就交付了丰富的动效。',
    limits: '依赖插件、可访问性差、耗电与安全成本高。',
    future: '浏览器会成为一座万能的交互影院。',
    legacy: 'Canvas、SVG、Web Audio、WebGL 与更强的 CSS 取代了它的大部分。',
    demo: 'flash',
  },
  {
    id: 'rss',
    name: 'RSS',
    era: '2000s',
    year: 1999,
    category: 'protocol',
    definition: '一种机器可读的新内容订阅源。',
    interface: '订阅列表、未读计数、按时间排列的标题。',
    uses: '博客、播客、新闻聚合、软件发布。',
    problem: '读者不必逐个访问网站就能获取更新。',
    limits: '发布者不统一、订阅源难发现、商业模式偏向平台。',
    future: '用户拥有由开放网络拼成的个性化信息流。',
    legacy: '播客分发、内容聚合，以及独立阅读器的复兴。',
    demo: 'rss',
  },
  {
    id: 'irc',
    name: 'IRC',
    era: '1990s–至今',
    year: 1988,
    category: 'community',
    definition: '围绕频道组织的实时文字聊天协议。',
    interface: '昵称、频道列表、简短命令与带时间戳的文本。',
    uses: '开源协作、社区、技术支持、直播活动。',
    problem: '在简陋的网络上实现了轻量的群组对话。',
    limits: '身份摩擦、垃圾信息、网络割裂、缺少富媒体。',
    future: '每个话题与项目都有常驻的公共房间。',
    legacy: 'Slack、Discord、Matrix 与 ChatOps 保留了频道式交互。',
    demo: 'irc',
  },
  {
    id: 'vmware',
    name: 'VMware 时代虚拟化',
    era: '1990s 末–2000s',
    year: 1999,
    category: 'virtualization',
    definition: '运行在宿主机里的软件定义的计算机。',
    interface: '宿主控制台里嵌着隔离的客户机窗口与虚拟设备。',
    uses: '服务器整合、测试、 legacy 应用、灾难恢复。',
    problem: '把操作系统与具体的物理机器解耦。',
    limits: '资源开销、镜像蔓延、比容器更慢的开机速度。',
    future: '数据中心会变成可移动的虚拟机资源池。',
    legacy: '云计算、快照、在线迁移与软件定义硬件。',
    demo: 'vm',
  },
  {
    id: 'docker',
    name: 'Docker',
    era: '2010s',
    year: 2013,
    category: 'infrastructure',
    definition: '用分层镜像打包进程的开发者友好模型。',
    interface: '镜像层、Dockerfile、镜像仓库与简短的命令行。',
    uses: '可复现的开发、部署、CI 与微服务。',
    problem: '减少了笔记本、CI 与服务器之间的环境漂移。',
    limits: '共享内核、镜像供应链风险、网络与存储复杂度。',
    future: '应用将以可移植单元的形态发往任何地方。',
    legacy: 'OCI 镜像与容器工作流成为基础设施原语。',
    demo: 'layers',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    era: '2010s 中–至今',
    year: 2014,
    category: 'infrastructure',
    definition: '调度与运维容器的声明式控制平面。',
    interface: '期望状态清单、Pod、节点、控制器与事件。',
    uses: '服务部署、扩缩容、韧性、平台工程。',
    problem: '在集群范围内协调容器的放置与生命周期。',
    limits: '运维复杂、抽象泄漏、调试成本高。',
    future: '基础设施会持续向声明的意图自收敛。',
    legacy: '调和循环与平台 API 塑造了现代运维。',
    demo: 'scheduler',
  },
  {
    id: 'llm',
    name: '大语言模型',
    era: '2020s',
    year: 2020,
    category: 'intelligence',
    definition: '根据上下文生成词元序列的统计模型。',
    interface: '提示词输入框、流式文本、上下文窗口与概率控制。',
    uses: '写作、编程、搜索辅助、摘要与分析。',
    problem: '让广泛的语言任务通过同一个接口触达。',
    limits: '幻觉、上下文上限、成本、延迟、推理不透明。',
    future: '自然语言可能成为通往计算的通用接口。',
    legacy: '仍在形成中：副驾驶、多模态界面与模型驱动的工具。',
    demo: 'tokens',
  },
  {
    id: 'agent',
    name: '智能体',
    era: '2020s 中',
    year: 2024,
    category: 'intelligence',
    definition: '由模型引导的循环：规划、调用工具、观察结果、验证进展。',
    interface: '目标、计划、工具调用、检查点、日志与审批闸门。',
    uses: '编程、研究、运维与工作流执行。',
    problem: '把语言模型从单次回答扩展到多步行动。',
    limits: '可靠性、权限、成本、误差累积与验证负担。',
    future: '软件或许会通过委托目标来操作，而不是直接命令。',
    legacy: '为时尚早；工具协议与评估循环正在浮现为基础。',
    demo: 'agent',
  },
];
