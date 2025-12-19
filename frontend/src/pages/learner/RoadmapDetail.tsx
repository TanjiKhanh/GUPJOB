import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node, 
  useNodesState, 
  useEdgesState,
  MiniMap,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams, useNavigate } from 'react-router-dom';

// Services
import { userService, UserRoadmapDetail } from '../../services/user.service';

// Components
import Header from '../../components/layouts/Header';
import RoadmapNode from '../../components/roadmap/RoadmapNode'; // The colorful card component
import RoadmapDrawer from '../../components/roadmap/RoadmapDrawer'; // The sidebar drawer
import '../../styles/roadmapDetail.css';

export default function RoadmapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // React Flow State
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Roadmap Data State
  const [roadmap, setRoadmap] = useState<UserRoadmapDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Drawer State
  const [selectedNodeDetail, setSelectedNodeDetail] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Register Custom Node Type (Matches the colorful UI in your pictures)
  const nodeTypes = useMemo(() => ({ roadmapNode: RoadmapNode }), []);

  // =========================================================
  // 1. INITIAL LOAD (Minimal Data)
  // =========================================================
  useEffect(() => {
    const loadRoadmap = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await userService.getRoadmapById(Number(id));
        
        // 🟢 FIX: Safety Check before accessing data.nodes
        if (!data || !data.nodes) {
            console.error("Invalid roadmap data received:", data);
            setRoadmap(null); // Will trigger the "Roadmap not found" UI
            return; 
        }

        setRoadmap(data);

        // Transform Nodes for React Flow
        // Now we know 'data' exists, so this won't crash
        const flowNodes: Node[] = data.nodes.map((node: any) => ({
          id: node.nodeKey,
          position: node.coords || { x: 0, y: 0 },
          type: 'roadmapNode', 
          data: { 
            title: node.title,
            status: node.status, 
            summary: node.summary 
          },
          selectable: true,
        }));

        // Transform Edges
        const flowEdges: Edge[] = (data.edges || []).map((edge: { sourceKey: any; targetKey: any; }, idx: any) => ({
          id: `e-${edge.sourceKey}-${edge.targetKey}-${idx}`,
          source: edge.sourceKey,
          target: edge.targetKey,
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5,5' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch (err) {
        console.error("Failed to load roadmap", err);
      } finally {
        setLoading(false);
      }
    };
    loadRoadmap();
  }, [id, setNodes, setEdges]);

  // =========================================================
  // 2. READ PHASE (Lazy Load Content)
  // =========================================================
  const onNodeClick = useCallback(async (event: React.MouseEvent, node: Node) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    
    // Clear previous detail to show loading state
    setSelectedNodeDetail(null); 

    try {
      // 🟢 Fetch heavy content (Markdown) on demand
      const detail = await userService.getNodeDetail(Number(id), node.id);
      
      // Merge fetched content with the current status from the map node
      // (The read endpoint doesn't usually return status, so we trust the map)
      const currentStatus = node.data.status; 
      
      setSelectedNodeDetail({ 
        ...detail, 
        status: currentStatus 
      });

    } catch (err) {
      console.error("Failed to load node content", err);
    } finally {
      setDrawerLoading(false);
    }
  }, [id]);

  // =========================================================
  // 3. WRITE PHASE (Update Status & Progress)
  // =========================================================
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedNodeDetail || !roadmap) return;
    
    // A. Optimistic Node Update (Change Color)
    setNodes((nds) => nds.map((n) => {
      if (n.id === selectedNodeDetail.nodeKey) {
        return { 
          ...n, 
          data: { ...n.data, status: newStatus } 
        };
      }
      return n;
    }));

    // B. Optimistic Drawer Update
    setSelectedNodeDetail((prev: any) => ({ ...prev, status: newStatus }));

    // C. 🟢 FIX: Recalculate Progress Bar Immediately
    const totalNodes = nodes.length;
    
    // Get current completed count from the nodes state (before this update)
    let completedCount = nodes.filter(n => n.data.status === 'COMPLETED').length;
    
    // Adjust based on the specific change happening right now
    const oldStatus = selectedNodeDetail.status;
    
    if (newStatus === 'COMPLETED' && oldStatus !== 'COMPLETED') {
      completedCount++; // User just finished a task
    } else if (newStatus !== 'COMPLETED' && oldStatus === 'COMPLETED') {
      completedCount--; // User unchecked a task
    }

    // Calculate new percentage (0 to 100)
    const newPercentage = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

    // Update the roadmap state so the bar moves!
    setRoadmap(prev => prev ? { ...prev, progress: newPercentage } : null);

    try {
      // D. Call Backend API
      await userService.updateNodeStatus(roadmap.id, selectedNodeDetail.nodeKey, newStatus);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to save progress. Please check your connection.");
      // In a real app, you might revert the optimistic update here
    }
  };

  if (loading) return <div className="loading-screen">Loading Roadmap...</div>;
  if (!roadmap) return <div className="error-screen">Roadmap not found</div>;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 🟢 TOP HEADER SECTION */}
      <div style={{ padding: '0 20px', background: 'white', borderBottom: '1px solid #eee' }}>
        <Header 
          title={roadmap.title} 
          subtitle="Interactive Learning Path"
        />
        
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Back Button */}
          <button 
            onClick={() => navigate('/dashboard/my-courses')} 
            className="btn-back"
            style={{ 
              padding: '8px 16px', 
              border: '1px solid #ddd', 
              background: 'white', 
              borderRadius: '6px', 
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            ← Back to List
          </button>

          {/* Progress Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '400px', margin: '0 20px' }}>
             <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3b82f6' }}>
               {roadmap.progress}%
             </span>
             <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${roadmap.progress}%`, height: '100%', background: '#3b82f6', transition: 'width 0.5s ease' }}></div>
             </div>
          </div>

          {/* Stats (Hidden on small screens) */}
          <div style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', gap: '16px' }}>
             <span><strong>{nodes.filter(n => n.data.status === 'COMPLETED').length}</strong> Completed</span>
             <span><strong>{nodes.length}</strong> Total</span>
          </div>

        </div>
      </div>

      {/* 🟢 MAP CANVAS */}
      <div style={{ flex: 1, background: '#f8f9fa', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick} // 👈 Triggers Lazy Load
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          minZoom={0.5}
          maxZoom={1.5}
        >
          <Background color="#cbd5e1" gap={24} size={1} />
          <Controls position="bottom-left" showInteractive={false} />
          <MiniMap 
            nodeStrokeWidth={3}
            nodeColor={(n) => {
               const status = n.data?.status;
               if (status === 'COMPLETED') return '#10b981';
               if (status === 'IN_PROGRESS') return '#eab308';
               return '#cbd5e1';
            }}
          />
        </ReactFlow>
      </div>

      {/* 🟢 DRAWER COMPONENT (The slidebar) */}
      <RoadmapDrawer 
        isOpen={drawerOpen}
        loading={drawerLoading}
        nodeDetail={selectedNodeDetail}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={handleStatusChange} // 👈 Handles "Write Phase"
      />
    </div>
  );
}