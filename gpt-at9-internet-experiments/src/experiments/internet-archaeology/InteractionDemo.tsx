import { useState } from 'react';
import type { Exhibit } from './exhibits';

export function InteractionDemo({ exhibit }: { exhibit: Exhibit }) {
  const [command, setCommand] = useState('help');
  const [terminalLines, setTerminalLines] = useState(['AT9 远程节点 / 输入 HELP 查看命令']);
  const [transfer, setTransfer] = useState<'idle' | 'active' | 'passive'>('idle');
  const [topic, setTopic] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [flash, setFlash] = useState(false);
  const [feeds, setFeeds] = useState(['系统周刊', '开放协议笔记']);
  const [messages, setMessages] = useState(['<站长> 欢迎来到 #at9-lab']);
  const [chat, setChat] = useState('');
  const [machine, setMachine] = useState<'host' | 'guest'>('host');
  const [layers, setLayers] = useState(['base: minimal-linux']);
  const [podNode, setPodNode] = useState<'none' | 'node-a' | 'node-b'>('none');
  const [tokens, setTokens] = useState<string[]>([]);
  const [agentStep, setAgentStep] = useState(0);

  if (exhibit.demo === 'terminal')
    return (
      <div className="demo terminal-demo">
        <div className="terminal-output">
          {terminalLines.map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const response =
              command === 'help'
                ? '命令：HELP、WHOAMI、STATUS、EXIT'
                : command === 'whoami'
                  ? 'GUEST@AT9'
                  : command === 'status'
                    ? '链路正常 / 明文通道'
                    : command === 'exit'
                      ? '连接已关闭'
                      : '未知命令';
            setTerminalLines((lines) => [...lines, `> ${command}`, response]);
            setCommand('');
          }}
        >
          <span>&gt;</span>
          <input
            aria-label="Telnet 命令"
            value={command}
            onChange={(event) => setCommand(event.target.value)}
          />
          <button>执行</button>
        </form>
      </div>
    );
  if (exhibit.demo === 'ftp')
    return (
      <div className="demo ftp-demo">
        <div>
          <strong>本地</strong>
          <button
            draggable
            onDragStart={(event) => event.dataTransfer.setData('text/plain', 'archive.tar')}
          >
            archive.tar · 24 MB
          </button>
        </div>
        <div className="ftp-channel">
          <span>控制通道 :21</span>
          <i />
          <span>数据通道 {transfer === 'passive' ? '服务器端口' : '客户端端口'}</span>
        </div>
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            setTransfer('passive');
          }}
        >
          <strong>远端</strong>
          <p>
            {transfer === 'idle'
              ? '把文件拖到这里'
              : `已通过${transfer === 'active' ? '主动' : '被动'}模式传输`}
          </p>
          <button onClick={() => setTransfer(transfer === 'active' ? 'passive' : 'active')}>
            模式：{transfer === 'active' ? '主动' : '被动'}
          </button>
        </div>
      </div>
    );
  if (exhibit.demo === 'bbs') {
    const topics = ['欢迎新用户', '调制解调器设置', '共享软件交换'];
    return (
      <div className="demo bbs-demo">
        <ol>
          {topics.map((name, index) => (
            <li key={name}>
              <button onClick={() => setTopic(index)}>
                {String(index + 1).padStart(2, '0')} {name}
              </button>
            </li>
          ))}
        </ol>
        <article>
          <h4>{topics[topic]}</h4>
          <p>来自：站长 · 23:14</p>
          <p>
            {topic === 0
              ? '先读版规，选一个昵称，聊完记得把线路让给下一位呼叫者。'
              : topic === 1
                ? '试试 9600 波特、硬件流控，并关闭本地回显。'
                : '请在午夜维护之前上传文件说明。'}
          </p>
        </article>
      </div>
    );
  }
  if (exhibit.demo === 'player')
    return (
      <div className="demo player-demo">
        <div className="player-display">
          <span>AT9 音频单元</span>
          <strong>{playing ? '播放中 / 信号研究 01' : '已停止'}</strong>
          <div className={playing ? 'equalizer playing' : 'equalizer'}>
            {Array.from({ length: 18 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
        <div className="player-buttons">
          <button onClick={() => setPlaying(false)}>■</button>
          <button onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ' : '▶'}</button>
          <button onClick={() => setPlaying(true)}>»</button>
        </div>
        <ol>
          <li>01 信号研究</li>
          <li>02 数据包花园</li>
        </ol>
      </div>
    );
  if (exhibit.demo === 'flash')
    return (
      <div className="demo flash-demo">
        <svg viewBox="0 0 420 230">
          <rect width="420" height="230" />
          <g className={flash ? 'flash-shape animate' : 'flash-shape'}>
            <circle cx="120" cy="115" r="45" />
            <path d="M210 65 320 115 210 165Z" />
          </g>
        </svg>
        <button onClick={() => setFlash((value) => !value)}>
          {flash ? '停止矢量循环' : '播放矢量循环'}
        </button>
      </div>
    );
  if (exhibit.demo === 'rss')
    return (
      <div className="demo rss-demo">
        <aside>
          {feeds.map((feed) => (
            <button key={feed}>{feed}</button>
          ))}
          <button
            onClick={() =>
              setFeeds((items) =>
                items.includes('AT9 实验室订阅源') ? items : [...items, 'AT9 实验室订阅源'],
              )
            }
          >
            + 订阅本地订阅源
          </button>
        </aside>
        <section>
          <article>
            <span>12:30</span>
            <h4>新的存储实验已发布</h4>
            <p>按时间排列的本地示例条目，没有请求任何远程订阅源。</p>
          </article>
          <article>
            <span>09:10</span>
            <h4>值得重新认识的浏览器原语</h4>
          </article>
        </section>
      </div>
    );
  if (exhibit.demo === 'irc')
    return (
      <div className="demo irc-demo">
        <div className="irc-channel">
          <strong>#at9-lab</strong>
          {messages.map((message, index) => (
            <p key={`${message}-${index}`}>{message}</p>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (chat.trim()) setMessages((items) => [...items, `<访客> ${chat}`]);
            setChat('');
          }}
        >
          <input
            aria-label="IRC 消息"
            value={chat}
            onChange={(event) => setChat(event.target.value)}
            placeholder="发送到 #at9-lab"
          />
          <button>发送</button>
        </form>
      </div>
    );
  if (exhibit.demo === 'vm')
    return (
      <div className="demo vm-demo">
        <div className="vm-tabs">
          <button className={machine === 'host' ? 'active' : ''} onClick={() => setMachine('host')}>
            宿主机
          </button>
          <button
            className={machine === 'guest' ? 'active' : ''}
            onClick={() => setMachine('guest')}
          >
            客户机 VM
          </button>
        </div>
        <div className={`machine-screen ${machine}`}>
          <strong>{machine === 'host' ? '宿主系统 / 16 GB 内存' : '客户系统 / 4 GB 虚拟内存'}</strong>
          <p>
            {machine === 'host'
              ? '物理 CPU、磁盘与网络接口。'
              : '虚拟 CPU、快照磁盘与模拟网卡。'}
          </p>
        </div>
      </div>
    );
  if (exhibit.demo === 'layers') {
    const options = ['runtime: js', 'app: server.js', 'config: production'];
    return (
      <div className="demo layer-demo">
        <div className="layer-stack">
          {layers.map((layer, index) => (
            <div key={layer} style={{ transform: `translateY(${index * 4}px)` }}>
              {layer}
            </div>
          ))}
        </div>
        <div>
          {options.map((layer) => (
            <button
              disabled={layers.includes(layer)}
              key={layer}
              onClick={() => setLayers((items) => [...items, layer])}
            >
              + {layer}
            </button>
          ))}
          <button onClick={() => setLayers(['base: minimal-linux'])}>重置镜像</button>
        </div>
      </div>
    );
  }
  if (exhibit.demo === 'scheduler')
    return (
      <div className="demo scheduler-demo">
        <div className="pod">POD / web-7d9</div>
        <div className="nodes">
          <button
            className={podNode === 'node-a' ? 'selected' : ''}
            onClick={() => setPodNode('node-a')}
          >
            节点 A<br />
            CPU 62%
          </button>
          <button
            className={podNode === 'node-b' ? 'selected' : ''}
            onClick={() => setPodNode('node-b')}
          >
            节点 B<br />
            CPU 31%
          </button>
        </div>
        <p>
          {podNode === 'none'
            ? '待调度：请选择一个节点'
            : `已调度：Pod 绑定到${podNode === 'node-a' ? '节点 A' : '节点 B'}`}
        </p>
      </div>
    );
  if (exhibit.demo === 'tokens') {
    const sequence = ['一次', '请求', '穿过', '网络', '，', '等待', '，', '然后', '返回', '。'];
    return (
      <div className="demo token-demo">
        <p>
          {tokens.join('')}
          <span className="token-cursor">▋</span>
        </p>
        <button
          disabled={tokens.length === sequence.length}
          onClick={() => setTokens((items) => [...items, sequence[items.length] ?? ''])}
        >
          生成下一个词元
        </button>
        <button onClick={() => setTokens([])}>重置上下文</button>
        <div className="token-probs">
          <span>网络 .42</span>
          <span>系统 .21</span>
          <span>边界 .09</span>
        </div>
      </div>
    );
  }
  const steps = [
    '目标：检查服务健康状况',
    '计划：读取状态，对比期望状态',
    '工具：查询本地模拟',
    '反馈：服务不可用',
    '验证：仲裁丢失，拒绝写入',
    '结论：给出纠正动作',
  ];
  return (
    <div className="demo agent-demo">
      <ol>
        {steps.map((step, index) => (
          <li
            className={index < agentStep ? 'done' : index === agentStep ? 'active' : ''}
            key={step}
          >
            <span>{index < agentStep ? '✓' : String(index + 1).padStart(2, '0')}</span>
            {step}
          </li>
        ))}
      </ol>
      <button
        disabled={agentStep >= steps.length}
        onClick={() => setAgentStep((value) => Math.min(steps.length, value + 1))}
      >
        推进控制循环
      </button>
      <button onClick={() => setAgentStep(0)}>重置</button>
    </div>
  );
}
