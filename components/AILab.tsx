import React, { useState, useRef } from 'react';
import { Upload, Wand2, Eye, Loader2, ImagePlus, X } from 'lucide-react';
import { Terminal } from './Terminal';
import { analyzeImage, editImage, fileToBase64 } from '../services/geminiService';
import { AI_MODE } from '../types';

export const AILab: React.FC = () => {
  const [mode, setMode] = useState<AI_MODE>(AI_MODE.EDIT);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultImage(null);
      setAnalysisText(null);
    }
  };

  const handleExecute = async () => {
    if (!imageFile) return;
    setLoading(true);
    setResultImage(null);
    setAnalysisText(null);

    try {
      const base64 = await fileToBase64(imageFile);
      
      if (mode === AI_MODE.ANALYZE) {
        const text = await analyzeImage(base64, imageFile.type, prompt || "详细分析这张技术架构图或系统截图。");
        setAnalysisText(text);
      } else {
        const editedImageBase64 = await editImage(base64, imageFile.type, prompt);
        setResultImage(editedImageBase64);
      }
    } catch (error) {
      console.error(error);
      setAnalysisText("执行任务失败，请检查控制台日志 (Error executing task).");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setResultImage(null);
    setAnalysisText(null);
    setPrompt('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="py-20 px-4 w-full max-w-6xl mx-auto">
       <h2 className="text-3xl font-bold mb-4 flex items-center">
        <span className="text-emerald-500 mr-2 font-mono">02.</span> 实验室 // GEMINI 协议
      </h2>
      <p className="text-slate-400 mb-12 max-w-2xl">
        交互式实验终端：调用 <span className="text-white font-mono">Gemini 2.5 Flash Image</span> 进行图像生成/编辑，以及 <span className="text-white font-mono">Gemini 3 Pro</span> 进行视觉智能分析。
      </p>

      <Terminal title={`root@at9:~/ai-lab/${mode.toLowerCase()}.sh`}>
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Control Panel */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* Mode Selection */}
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setMode(AI_MODE.EDIT)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === AI_MODE.EDIT ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Wand2 size={16} />
                  <span>Nano 编辑</span>
                </div>
              </button>
              <button
                onClick={() => setMode(AI_MODE.ANALYZE)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === AI_MODE.ANALYZE ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Eye size={16} />
                  <span>视觉分析</span>
                </div>
              </button>
            </div>

            {/* Upload Area */}
            <div 
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${previewUrl ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'}`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <div className="relative group">
                   <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded border border-slate-600" />
                   <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full p-1 border border-slate-700 cursor-pointer hover:bg-red-900/50" onClick={(e) => { e.preventDefault(); clearAll(); }}>
                      <X size={14} className="text-red-400" />
                   </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-center">
                     <ImagePlus className="w-10 h-10 text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-400">点击上传图片 Buffer</p>
                  <p className="text-xs text-slate-600">支持 JPG, PNG 格式</p>
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                {mode === AI_MODE.EDIT ? '编辑指令 (Prompt)' : '分析参数 (可选)'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === AI_MODE.EDIT ? '例如："添加一个赛博朋克风格的护目镜", "把背景换成矩阵代码雨"' : '例如："解释这张图中的网络拓扑结构", "分析代码截图中的错误"'}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-sm text-emerald-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 h-24 resize-none placeholder-slate-600"
              />
            </div>

            <button
              onClick={handleExecute}
              disabled={!imageFile || loading || (mode === AI_MODE.EDIT && !prompt)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-md font-mono text-sm font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>正在处理 (PROCESSING)...</span>
                </>
              ) : (
                <>
                  <span>执行协议 (EXECUTE)</span>
                </>
              )}
            </button>
          </div>

          {/* Output Display */}
          <div className="w-full lg:w-2/3 bg-black/30 rounded-lg border border-slate-800 p-4 min-h-[400px] flex items-center justify-center relative overflow-hidden">
            {/* Grid Background within output */}
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
            
            {!resultImage && !analysisText && !loading && (
              <div className="text-center text-slate-600 font-mono">
                <p>{'>'} 等待输入 (AWAITING INPUT)...</p>
              </div>
            )}

            {loading && (
              <div className="space-y-4 text-center z-10">
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-emerald-500 font-mono text-xs animate-pulse">
                  {mode === AI_MODE.EDIT ? '正在调用 NANO BANANA 生成像素...' : 'GEMINI 3 PRO 正在解析向量...'}
                </p>
              </div>
            )}

            {resultImage && mode === AI_MODE.EDIT && (
               <div className="relative z-10 w-full h-full flex flex-col items-center">
                  <div className="bg-emerald-950/30 text-emerald-400 text-xs px-2 py-1 rounded mb-2 border border-emerald-500/20 font-mono">
                    生成完毕 (GENERATION COMPLETE)
                  </div>
                  <img src={resultImage} alt="Generated Result" className="max-w-full max-h-[500px] rounded shadow-2xl border border-emerald-500/30" />
               </div>
            )}

            {analysisText && mode === AI_MODE.ANALYZE && (
              <div className="w-full h-full overflow-auto z-10 text-left">
                <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-purple-500/30">
                  <Eye className="text-purple-400" size={18} />
                  <h3 className="text-purple-400 font-mono text-sm">ANALYSIS_REPORT.LOG</h3>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed">
                  {analysisText}
                </pre>
              </div>
            )}
          </div>
        </div>
      </Terminal>
    </div>
  );
};