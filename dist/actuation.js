(function(root){
  'use strict';
  // The electrical edge is gated by two painted frames and the cap's travel.
  // Quick taps keep a minimum visible press and a real, bounded contact pulse.
  function create(options){
    const frame=options.frame||root.requestAnimationFrame.bind(root),cancelFrame=options.cancelFrame||root.cancelAnimationFrame.bind(root);
    const later=options.later||setTimeout,cancelLater=options.cancelLater||clearTimeout,now=options.now||(()=>performance.now());
    const travel=options.travel??85,pulse=options.pulse??55,channels=new Map();
    let sequence=0;
    function valid(ch){return channels.get(ch.id)===ch&&(!options.valid||options.valid(ch.id))}
    function visual(ch,down,restart=false){if(valid(ch))options.visual(ch.id,down,restart)}
    function finish(ch,job){
      if(!valid(ch)||ch.active!==job)return;
      if(job.momentary)options.commit(ch.id,false);
      ch.active=null;ch.queue.shift();flush(ch);
    }
    function flush(ch){
      if(!valid(ch))return;
      if(ch.active){
        const job=ch.active;
        if(job.released&&!job.releaseTimer)job.releaseTimer=later(()=>{job.releaseTimer=null;finish(ch,job)},Math.max(0,pulse-(now()-job.committedAt)));
        return;
      }
      const job=ch.queue[0];if(!job?.ready)return;
      ch.active=job;job.committedAt=now();
      options.commit(ch.id,job.momentary?true:'toggle');
      if(!valid(ch))return;
      if(!job.momentary){ch.active=null;ch.queue.shift();flush(ch)}else flush(ch);
    }
    function press(id,momentary=true){
      let ch=channels.get(id);if(!ch){ch={id,queue:[],active:null,latest:null};channels.set(id,ch)}
      const job={id,sequence:++sequence,momentary,released:false,ready:false,frames:[],timer:null};
      ch.queue.push(job);ch.latest=job;visual(ch,true,true);
      job.frames.push(frame(()=>{
        if(!valid(ch))return;
        job.frames.push(frame(()=>{
          if(!valid(ch))return;
          job.timer=later(()=>{
            if(!valid(ch))return;
            job.ready=true;job.timer=null;
            if(job.released&&ch.latest===job)visual(ch,false);
            flush(ch);
          },travel);
        }));
      }));
      return job;
    }
    function release(job){
      const ch=job&&channels.get(job.id);if(!ch||job.released||(!ch.queue.includes(job)&&ch.latest!==job))return;
      job.released=true;
      if(job.ready&&ch.latest===job)visual(ch,false);
      flush(ch);
    }
    function cancel(id){
      const ch=channels.get(id);if(!ch)return;
      for(const job of new Set([...ch.queue,ch.latest,ch.active].filter(Boolean))){
        job.frames.forEach(cancelFrame);if(job.timer!==null)cancelLater(job.timer);if(job.releaseTimer)cancelLater(job.releaseTimer);
      }
      visual(ch,false);channels.delete(id);
    }
    function cancelAll(){for(const id of [...channels.keys()])cancel(id)}
    function releaseAll(){for(const ch of channels.values())for(const job of new Set([...ch.queue,ch.latest].filter(Boolean)))release(job)}
    return {press,release,cancel,cancelAll,releaseAll};
  }
  const api={create};if(typeof module==='object'&&module.exports)module.exports=api;else root.CCSActuation=api;
})(typeof window==='undefined'?globalThis:window);
