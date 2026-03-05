'use client';
import { useState, useRef } from 'react';

export default function AssessmentPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!name) { setError('Please enter your full name.'); return; }
    if (!email) { setError('Please enter your email address.'); return; }
    if (!file1) { setError('Please upload your Part 1 recording.'); return; }
    if (!file2) { setError('Please upload your Part 2 recording.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const toBase64 = (f: File) => new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res((r.result as string).split(',')[1]);
        r.onerror = rej;
        r.readAsDataURL(f);
      });
      const [data1, data2] = await Promise.all([toBase64(file1), toBase64(file2)]);
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email,
          file1: { name: file1.name, type: file1.type, data: data1 },
          file2: { name: file2.name, type: file2.type, data: data2 },
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:'#faf8f4',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'white',borderRadius:16,padding:'48px 40px',maxWidth:480,textAlign:'center',boxShadow:'0 4px 24px rgba(15,31,61,0.08)'}}>
        <div style={{fontSize:48,marginBottom:16}}>🎉</div>
        <div style={{fontSize:22,fontWeight:700,color:'#0f1f3d',marginBottom:10}}>Assessment Submitted!</div>
        <div style={{fontSize:13.5,color:'#374151',lineHeight:1.65}}>Thank you for completing the Lead Manager Assessment. Our team will review your recordings and be in touch within 2–3 business days.</div>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:'#faf8f4',minHeight:'100vh'}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{background:'#0f1f3d',padding:'0 48px',position:'relative'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#f5820a,#ffa040,transparent)'}}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'24px 0 20px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:34,height:34,background:'#1a3260',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>⚡</div>
            <div style={{fontSize:15,fontWeight:700}}><span style={{color:'#f5820a'}}>insta</span><span style={{color:'white'}}>pad</span></div>
          </div>
          <div style={{display:'flex',gap:12}}>
            <span style={{fontFamily:'DM Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.45)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:'4px 10px',letterSpacing:1,textTransform:'uppercase'}}>Confidential</span>
            <span style={{fontFamily:'DM Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.45)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:'4px 10px',letterSpacing:1,textTransform:'uppercase'}}>Lead Manager · Candidate Assessment</span>
          </div>
        </div>
        <div style={{padding:'28px 0 32px'}}>
          <div style={{fontFamily:'DM Mono,monospace',fontSize:9,fontWeight:600,letterSpacing:'2.5px',textTransform:'uppercase',color:'#f5820a',marginBottom:8}}>Hiring · Assessment</div>
          <div style={{fontSize:26,fontWeight:700,color:'white',letterSpacing:'-0.5px'}}>Lead Manager Assessment</div>
          <div style={{fontSize:13.5,color:'rgba(255,255,255,0.55)',marginTop:6,lineHeight:1.6,maxWidth:560}}>Thank you for your interest in joining our team. This short assessment helps us get to know you better — please read through carefully before recording.</div>
        </div>
      </div>

      {/* Body */}
      <div style={{maxWidth:820,margin:'0 auto',padding:'36px 48px 60px'}}>

        {/* Intro */}
        <div style={{background:'white',border:'1px solid #e2e8f0',borderRadius:14,padding:'24px 28px',marginBottom:24,boxShadow:'0 2px 8px rgba(15,31,61,0.04)'}}>
          <p style={{fontSize:13.5,lineHeight:1.7,color:'#374151'}}>This assessment consists of two short recordings. There are no right or wrong answers — we simply want to hear you speak naturally and confidently in English. Please complete both parts and upload your audio or video files below.</p>
          <p style={{fontSize:13.5,lineHeight:1.7,color:'#374151',marginTop:10}}>Take a moment to read each prompt before recording. You do not need to rehearse — we're looking for natural, conversational delivery. Please complete and submit within <strong>24 hours</strong> of receiving this link.</p>
        </div>

        {/* Candidate Info */}
        <div style={{background:'white',border:'1px solid #e2e8f0',borderRadius:16,overflow:'hidden',boxShadow:'0 2px 12px rgba(15,31,61,0.05)',marginBottom:20}}>
          <div style={{background:'#0f1f3d',padding:'18px 24px',display:'flex',alignItems:'center',gap:16}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:'#243d72',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>👤</div>
            <div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:9,fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(255,255,255,0.4)'}}>Before You Begin</div>
              <div style={{fontSize:15,fontWeight:700,color:'white'}}>Your Information</div>
            </div>
          </div>
          <div style={{padding:'22px 24px'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div>
                <label style={{display:'block',fontFamily:'DM Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#5a6a8a',marginBottom:6}}>Full Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="First and last name" style={{width:'100%',border:'1.5px solid #e2e8f0',borderRadius:8,padding:'10px 14px',fontSize:13.5,fontFamily:'DM Sans,sans-serif',outline:'none',background:'#fafafa'}} />
              </div>
              <div>
                <label style={{display:'block',fontFamily:'DM Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#5a6a8a',marginBottom:6}}>Email Address</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" type="email" style={{width:'100%',border:'1.5px solid #e2e8f0',borderRadius:8,padding:'10px 14px',fontSize:13.5,fontFamily:'DM Sans,sans-serif',outline:'none',background:'#fafafa'}} />
              </div>
            </div>
          </div>
        </div>

        {/* Part 1 */}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <div style={{width:28,height:2,background:'#f5820a',borderRadius:2}}/>
          <span style={{fontFamily:'DM Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#f5820a'}}>Part One</span>
        </div>
        <div style={{background:'white',border:'1px solid #e2e8f0',borderRadius:16,overflow:'hidden',boxShadow:'0 2px 12px rgba(15,31,61,0.05)',marginBottom:20}}>
          <div style={{background:'#0f1f3d',padding:'18px 24px',display:'flex',alignItems:'center',gap:16}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:'#f5820a',color:'white',fontSize:15,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Mono,monospace'}}>1</div>
            <div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:9,fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(255,255,255,0.4)'}}>Spoken Response</div>
              <div style={{fontSize:15,fontWeight:700,color:'white'}}>Situational Prompt</div>
            </div>
          </div>
          <div style={{padding:'22px 24px',display:'flex',flexDirection:'column',gap:16}}>
            <p style={{fontSize:13.5,color:'#374151',lineHeight:1.7}}>Read the scenario below, then record a <strong>60–90 second spoken response</strong> as if you were the Lead Manager handling this situation live. Speak naturally — do not read from a script or rehearse.</p>
            <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:10,padding:'16px 20px'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#1d4ed8',marginBottom:8}}>🎯 Your Scenario</div>
              <div style={{fontSize:13.5,color:'#1e3a5f',lineHeight:1.7}}>You're on a call with a seller. You've introduced yourself and confirmed who you're speaking with. The seller then says: <strong>"You know what, I'm actually not interested anymore — I've changed my mind about selling."</strong><br/><br/>How do you respond? Record your reaction and what you would say next to keep the conversation going.</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {['Keep your response between 60 and 90 seconds','Speak as if you are on a live phone call — natural and conversational','Do not read from a script or prepare a written response first','Audio or video recording is acceptable (voice memo, Loom, phone recording, etc.)'].map((g,i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:13,color:'#374151'}}><div style={{width:6,height:6,borderRadius:'50%',background:'#f5820a',marginTop:5,flexShrink:0}}/>{g}</div>
              ))}
            </div>
            <div onClick={()=>ref1.current?.click()} style={{border:`2px dashed ${file1?'#1a7a4a':'#cbd5e1'}`,borderRadius:12,padding:'32px 24px',textAlign:'center',cursor:'pointer',background:file1?'#f0faf4':'#f8fafc',transition:'all 0.2s'}}>
              <input ref={ref1} type="file" accept="audio/*,video/*" style={{display:'none'}} onChange={e=>setFile1(e.target.files?.[0]||null)} />
              <div style={{fontSize:28,marginBottom:8}}>{file1?'✅':'🎙️'}</div>
              <div style={{fontSize:13.5,fontWeight:600,color:file1?'#1a7a4a':'#0f1f3d'}}>{file1?file1.name:'Upload Part 1 Recording'}</div>
              <div style={{fontSize:12,color:'#5a6a8a',marginTop:4}}>{file1?'Click to change file':'Drag & drop or click to browse — MP3, MP4, MOV, M4A, WAV accepted'}</div>
            </div>
          </div>
        </div>

        {/* Part 2 */}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <div style={{width:28,height:2,background:'#f5820a',borderRadius:2}}/>
          <span style={{fontFamily:'DM Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#f5820a'}}>Part Two</span>
        </div>
        <div style={{background:'white',border:'1px solid #e2e8f0',borderRadius:16,overflow:'hidden',boxShadow:'0 2px 12px rgba(15,31,61,0.05)',marginBottom:20}}>
          <div style={{background:'#0f1f3d',padding:'18px 24px',display:'flex',alignItems:'center',gap:16}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:'#f5820a',color:'white',fontSize:15,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Mono,monospace'}}>2</div>
            <div>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:9,fontWeight:500,letterSpacing:'2px',textTransform:'uppercase',color:'rgba(255,255,255,0.4)'}}>Script Reading</div>
              <div style={{fontSize:15,fontWeight:700,color:'white'}}>Voicemail Script</div>
            </div>
          </div>
          <div style={{padding:'22px 24px',display:'flex',flexDirection:'column',gap:16}}>
            <p style={{fontSize:13.5,color:'#374151',lineHeight:1.7}}>Read the script below out loud and record yourself delivering it as a professional voicemail. Replace <strong>[Your Name]</strong> with your actual name.</p>
            <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:10,padding:'16px 20px'}}>
              <div style={{fontFamily:'DM Mono,monospace',fontSize:9,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#5a6a8a',marginBottom:8}}>📋 Your Script</div>
              <div style={{fontSize:13.5,color:'#1e3a5f',lineHeight:1.8,fontStyle:'italic'}}>"Hi, this is [Your Name] with Instapad Offer. I'm calling you because you recently spoke with one of my team members about potentially selling your property. I'd like to connect with you and discuss the details to see how we can help. Feel free to call me back at 678-459-0312, or send me a text if that's easier for you. I'm looking forward to speaking with you soon. Thanks!"</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {['Read the script exactly as written — do not paraphrase or improvise','Replace [Your Name] with your actual first name','Speak clearly and at a natural pace — not too fast, not too slow','You may record one take or multiple — submit the one you\'re most confident in'].map((g,i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:13,color:'#374151'}}><div style={{width:6,height:6,borderRadius:'50%',background:'#f5820a',marginTop:5,flexShrink:0}}/>{g}</div>
              ))}
            </div>
            <div onClick={()=>ref2.current?.click()} style={{border:`2px dashed ${file2?'#1a7a4a':'#cbd5e1'}`,borderRadius:12,padding:'32px 24px',textAlign:'center',cursor:'pointer',background:file2?'#f0faf4':'#f8fafc',transition:'all 0.2s'}}>
              <input ref={ref2} type="file" accept="audio/*,video/*" style={{display:'none'}} onChange={e=>setFile2(e.target.files?.[0]||null)} />
              <div style={{fontSize:28,marginBottom:8}}>{file2?'✅':'🎤'}</div>
              <div style={{fontSize:13.5,fontWeight:600,color:file2?'#1a7a4a':'#0f1f3d'}}>{file2?file2.name:'Upload Part 2 Recording'}</div>
              <div style={{fontSize:12,color:'#5a6a8a',marginTop:4}}>{file2?'Click to change file':'Drag & drop or click to browse — MP3, MP4, MOV, M4A, WAV accepted'}</div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div style={{background:'#fee2e2',border:'1px solid #fca5a5',borderRadius:10,padding:'12px 16px',fontSize:13,color:'#7f1d1d',marginBottom:16}}>⚠️ {error}</div>}

        {/* Submit */}
        <div style={{textAlign:'center',marginTop:8}}>
          <button onClick={handleSubmit} disabled={submitting} style={{background:submitting?'#94a3b8':'#f5820a',color:'white',border:'none',borderRadius:10,padding:'16px 48px',fontSize:15,fontWeight:700,cursor:submitting?'not-allowed':'pointer',letterSpacing:'-0.2px',transition:'background 0.2s'}}>
            {submitting?'Uploading & Submitting…':'Submit Assessment →'}
          </button>
          <p style={{fontSize:12,color:'#5a6a8a',marginTop:12,lineHeight:1.6}}>By submitting, you confirm that both recordings are your own and were completed without assistance. Your information is kept confidential and used for hiring purposes only.</p>
        </div>

        {/* Footer */}
        <div style={{borderTop:'1px solid #e2e8f0',marginTop:48,paddingTop:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontFamily:'DM Mono,monospace',fontSize:10,color:'#5a6a8a',letterSpacing:'0.5px'}}>Instapad Offer · Hiring · Confidential</span>
          <span style={{fontFamily:'DM Mono,monospace',fontSize:10,color:'#5a6a8a',background:'#f1f5f9',padding:'3px 10px',borderRadius:20}}>Lead Manager Assessment</span>
        </div>
      </div>
    </div>
  );
}
