import React from 'react';
import { Scale, FileText, UserCheck } from 'lucide-react';

export const LicenseTab: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Header */}
      <div className="card-surface rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Scale size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Custom MIT License & Terms</h2>
            <p className="text-xs text-white/60">Copyright © {currentYear} Zeus Angelo Bautista</p>
          </div>
        </div>
      </div>

      {/* License Body */}
      <div className="card-surface rounded-2xl p-6 border border-white/5 space-y-4 font-mono text-xs text-white/80 leading-relaxed bg-[#101010]">
        <div className="text-sm font-bold text-white mb-2">
          MIT License with Attribution Requirement
        </div>

        <p>
          Copyright (c) {currentYear} <b>Zeus Angelo Bautista</b>
        </p>

        <p>
          Permission is hereby granted, free of charge, to any person obtaining a copy
          of this software and associated documentation files (the &quot;Software&quot;), to deal
          in the Software without restriction, including without limitation the rights
          to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
          copies of the Software, and to permit persons to whom the Software is
          furnished to do so, subject to the following conditions:
        </p>

        <ol className="list-decimal pl-5 space-y-2 text-white/90 font-sans">
          <li>
            The Software may not be sold or included in any commercial product or service without prior written permission.
          </li>
          <li>
            If you modify, redistribute, or reuse any part of this Software, you must give clear credit to the original author: <b>Zeus Angelo Bautista</b>.
          </li>
          <li>
            The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
          </li>
        </ol>

        <div className="pt-3 border-t border-white/10 text-white/50 text-[11px] leading-normal font-mono">
          THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
          AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
          LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
          OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
          THE SOFTWARE.
        </div>
      </div>
    </div>
  );
};
