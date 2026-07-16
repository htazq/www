import { useState } from 'react';
import type { Exhibit } from './exhibits';

export function InteractionDemo({ exhibit }: { exhibit: Exhibit }) {
  const [command, setCommand] = useState('help');
  const [terminalLines, setTerminalLines] = useState(['AT9 REMOTE NODE / TYPE HELP']);
  const [transfer, setTransfer] = useState<'idle' | 'active' | 'passive'>('idle');
  const [topic, setTopic] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [flash, setFlash] = useState(false);
  const [feeds, setFeeds] = useState(['Systems Weekly', 'Open Protocol Notes']);
  const [messages, setMessages] = useState(['<operator> welcome to #at9-lab']);
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
                ? 'COMMANDS: HELP, WHOAMI, STATUS, EXIT'
                : command === 'whoami'
                  ? 'GUEST@AT9'
                  : command === 'status'
                    ? 'LINK UP / CLEAR TEXT CHANNEL'
                    : command === 'exit'
                      ? 'CONNECTION CLOSED'
                      : 'UNKNOWN COMMAND';
            setTerminalLines((lines) => [...lines, `> ${command}`, response]);
            setCommand('');
          }}
        >
          <span>&gt;</span>
          <input
            aria-label="Telnet command"
            value={command}
            onChange={(event) => setCommand(event.target.value)}
          />
          <button>RUN</button>
        </form>
      </div>
    );
  if (exhibit.demo === 'ftp')
    return (
      <div className="demo ftp-demo">
        <div>
          <strong>LOCAL</strong>
          <button
            draggable
            onDragStart={(event) => event.dataTransfer.setData('text/plain', 'archive.tar')}
          >
            archive.tar · 24 MB
          </button>
        </div>
        <div className="ftp-channel">
          <span>CONTROL :21</span>
          <i />
          <span>DATA {transfer === 'passive' ? 'SERVER PORT' : 'CLIENT PORT'}</span>
        </div>
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            setTransfer('passive');
          }}
        >
          <strong>REMOTE</strong>
          <p>
            {transfer === 'idle'
              ? 'DROP FILE HERE'
              : `TRANSFERRED VIA ${transfer.toUpperCase()} MODE`}
          </p>
          <button onClick={() => setTransfer(transfer === 'active' ? 'passive' : 'active')}>
            MODE: {transfer === 'active' ? 'ACTIVE' : 'PASSIVE'}
          </button>
        </div>
      </div>
    );
  if (exhibit.demo === 'bbs') {
    const topics = ['WELCOME NEW USERS', 'MODEM CONFIGURATION', 'SHAREWARE EXCHANGE'];
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
          <p>FROM: SYSOP · 23:14</p>
          <p>
            {topic === 0
              ? 'Read the rules, choose a handle, and leave the line free for the next caller.'
              : topic === 1
                ? 'Try 9600 baud, hardware flow control, and disable local echo.'
                : 'Upload descriptions before midnight maintenance.'}
          </p>
        </article>
      </div>
    );
  }
  if (exhibit.demo === 'player')
    return (
      <div className="demo player-demo">
        <div className="player-display">
          <span>AT9 AUDIO UNIT</span>
          <strong>{playing ? 'PLAYING / SIGNAL STUDY 01' : 'STOPPED'}</strong>
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
          <li>01 SIGNAL STUDY</li>
          <li>02 PACKET GARDEN</li>
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
          {flash ? 'STOP VECTOR LOOP' : 'PLAY VECTOR LOOP'}
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
                items.includes('AT9 Lab Feed') ? items : [...items, 'AT9 Lab Feed'],
              )
            }
          >
            + SUBSCRIBE LOCAL FEED
          </button>
        </aside>
        <section>
          <article>
            <span>12:30</span>
            <h4>New storage experiment published</h4>
            <p>Chronological, local sample item. No remote feed requested.</p>
          </article>
          <article>
            <span>09:10</span>
            <h4>Browser primitives worth revisiting</h4>
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
            if (chat.trim()) setMessages((items) => [...items, `<guest> ${chat}`]);
            setChat('');
          }}
        >
          <input
            aria-label="IRC message"
            value={chat}
            onChange={(event) => setChat(event.target.value)}
            placeholder="message #at9-lab"
          />
          <button>SEND</button>
        </form>
      </div>
    );
  if (exhibit.demo === 'vm')
    return (
      <div className="demo vm-demo">
        <div className="vm-tabs">
          <button className={machine === 'host' ? 'active' : ''} onClick={() => setMachine('host')}>
            HOST MACHINE
          </button>
          <button
            className={machine === 'guest' ? 'active' : ''}
            onClick={() => setMachine('guest')}
          >
            GUEST VM
          </button>
        </div>
        <div className={`machine-screen ${machine}`}>
          <strong>
            {machine === 'host' ? 'HOST OS / 16 GB RAM' : 'GUEST OS / 4 GB VIRTUAL RAM'}
          </strong>
          <p>
            {machine === 'host'
              ? 'Physical CPU, disks, and network interfaces.'
              : 'Virtual CPU, snapshot disk, emulated network adapter.'}
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
          <button onClick={() => setLayers(['base: minimal-linux'])}>RESET IMAGE</button>
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
            NODE A<br />
            CPU 62%
          </button>
          <button
            className={podNode === 'node-b' ? 'selected' : ''}
            onClick={() => setPodNode('node-b')}
          >
            NODE B<br />
            CPU 31%
          </button>
        </div>
        <p>
          {podNode === 'none'
            ? 'PENDING: choose a node'
            : 'SCHEDULED: pod bound to ' + podNode.toUpperCase()}
        </p>
      </div>
    );
  if (exhibit.demo === 'tokens') {
    const sequence = [
      'The',
      ' request',
      ' crosses',
      ' a',
      ' network',
      ',',
      ' waits',
      ',',
      ' then',
      ' returns',
      '.',
    ];
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
          GENERATE NEXT TOKEN
        </button>
        <button onClick={() => setTokens([])}>RESET CONTEXT</button>
        <div className="token-probs">
          <span>network .42</span>
          <span>system .21</span>
          <span>boundary .09</span>
        </div>
      </div>
    );
  }
  const steps = [
    'GOAL: inspect service health',
    'PLAN: read status, compare expected state',
    'TOOL: query local simulation',
    'FEEDBACK: service unavailable',
    'VERIFY: quorum lost; refuse writes',
    'RESULT: explain corrective action',
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
        ADVANCE CONTROL LOOP
      </button>
      <button onClick={() => setAgentStep(0)}>RESET</button>
    </div>
  );
}
