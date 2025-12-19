import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export interface RoadmapNodeData {
  title: string;
  status:  'COMPLETED' | 'IN_PROGRESS' | 'AVAILABLE' | 'SKIPPED';
  summary?: string;
}

const RoadmapNode = ({ data, selected }: NodeProps<RoadmapNodeData>) => {
  
  // 🎨 Style Configuration based on Status
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED': 
        return { 
          styleClass: 'node-verified', 
          icon: '✓', 
          badgeText: 'Verified',
          handleColor: '#A855F7' // Purple
        };
      case 'IN_PROGRESS': 
        return { 
          styleClass: 'node-in-progress', 
          icon: '⟳', 
          badgeText: 'In Progress', 
          handleColor: '#EAB308' // Yellow
        };
      case 'SKIPPED':
        return {
          styleClass: 'node-skipped',
          icon: '⏭',
          badgeText: 'Skipped',
          handleColor: '#94a3b8'
        };
      default: 
        return { 
          styleClass: 'node-available', 
          icon: '▶', 
          badgeText: 'Available', 
          handleColor: '#3B82F6' // Blue
        };
    }
  };

  const config = getStatusConfig(data.status || 'LOCKED');

  return (
    <div className={`roadmap-node-card ${config.styleClass} ${selected ? 'selected' : ''}`}>
      
      {/* Left Connection Handle */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="node-handle"
        style={{ borderColor: config.handleColor }}
      />

      {/* Header: Badge (Left) & Icon (Right) */}
      <div className="node-header">
        <span className="node-badge">{config.badgeText}</span>
        <span className="node-icon">{config.icon}</span>
      </div>
      
      {/* Content */}
      <div className="node-content">
        <h3 className="node-title">{data.title}</h3>
        <p className="node-summary">
          {data.summary || "Master this topic to unlock new skills."}
        </p>
      </div>

      {/* Right Connection Handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="node-handle"
        style={{ borderColor: config.handleColor }}
      />
    </div>
  );
};

export default memo(RoadmapNode);