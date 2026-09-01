import React from 'react';
import { Scale } from 'lucide-react';

export const LicenseTab: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div
        className="card-surface rounded-2xl p-6 cursor-target transition-colors duration-200"
        style={{
          backgroundColor: 'var(--menu-surface)',
          border: '1px solid var(--menu-card-border)'
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Scale size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--menu-text-primary)' }}>
              Custom MIT License & Terms
            </h2>
            <p className="text-xs" style={{ color: 'var(--menu-text-muted)' }}>
              Copyright © {currentYear} Zeus Angelo Bautista
            </p>
          </div>
        </div>
      </div>

      {/* License Body */}
      <div
        className="card-surface rounded-2xl p-6 space-y-4 font-mono text-xs leading-relaxed cursor-target transition-colors duration-200"
        style={{
          backgroundColor: 'var(--menu-input-bg)',
          border: '1px solid var(--menu-card-border)',
          color: 'var(--menu-text-secondary)'
        }}
      >
        <div className="text-sm font-bold font-sans" style={{ color: 'var(--menu-text-primary)' }}>
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

        <ol className="list-decimal pl-5 space-y-2 font-sans" style={{ color: 'var(--menu-text-primary)' }}>
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

        <div
          className="pt-3 text-[11px] leading-normal font-mono"
          style={{
            borderTop: '1px solid var(--menu-divider)',
            color: 'var(--menu-text-muted)'
          }}
        >
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
