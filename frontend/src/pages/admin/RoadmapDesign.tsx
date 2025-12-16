import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  Connection, 
  Edge, 
  Node, 
  useNodesState, 
  useEdgesState,
  MiniMap,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import Header from '../../components/layouts/Header';

export default function RoadmapDesigner() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [roadmapTitle, setRoadmapTitle] = useState('');
  const [roadmapId, setRoadmapId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // =========================================================
  // 1. FETCH & TRANSFORM (DB -> ReactFlow)
  // =========================================================
  useEffect(() => {
    const loadRoadmap = async () => {
      if (!slug) return;
      try {
        const data = await adminService.getRoadmapBySlug(slug);
        setRoadmapTitle(data.title);
        setRoadmapId(data.id!);

        // A. Transform Nodes
        // DB: { nodeKey: "html-css", coords: {x,y}, title: "..." }
        // RF: { id: "html-css", position: {x,y}, data: { label: "..." } }
        const flowNodes: Node[] = (data.nodes || []).map((dbNode: any) => ({
          id: dbNode.nodeKey, 
          position: dbNode.coords || { x: 0, y: 0 },
          data: { label: dbNode.title },
          type: 'default' 
        }));

        // B. Transform Edges
        // DB: { sourceKey: "html-css", targetKey: "js" }
        // RF: { id: "e-html-css-js", source: "html-css", target: "js" }
        const flowEdges: Edge[] = (data.edges || []).map((dbEdge: any) => ({
          id: `e-${dbEdge.sourceKey}-${dbEdge.targetKey}`,
          source: dbEdge.sourceKey,
          target: dbEdge.targetKey,
          type: 'smoothstep', // nice curved lines
          markerEnd: { type: MarkerType.ArrowClosed }, // Add arrow at end
        }));

        // If empty, add a default start node
        if (flowNodes.length === 0) {
          setNodes([{ id: 'start', position: { x: 250, y: 50 }, data: { label: 'Start Topic' } }]);
        } else {
          setNodes(flowNodes);
          setEdges(flowEdges);
        }

      } catch (err) {
        console.error("Failed to load roadmap", err);
        alert("Could not load roadmap data");
      }
    };
    loadRoadmap();
  }, [slug, setNodes, setEdges]);

  // =========================================================
  // 2. HANDLERS
  // =========================================================
  
  // Connect two nodes
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, eds));
  }, [setEdges]);

  // Double Click to Rename Node
  const onNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    const newLabel = prompt("Enter new title for this topic:", node.data.label);
    if (newLabel) {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            n.data = { ...n.data, label: newLabel };
          }
          return n;
        })
      );
    }
  };

  // Add new node button
  const addNode = () => {
    // Generate a simple ID (e.g., "node-1234") to act as the unique key
    const id = `node-${Math.floor(Math.random() * 10000)}`;
    const newNode: Node = {
      id,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
      data: { label: 'New Topic' }, 
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // =========================================================
  // 3. SAVE (ReactFlow -> DB)
  // =========================================================
  const handleSave = async () => {
    if (!roadmapId) return;
    setSaving(true);
    try {
      // A. Convert ReactFlow Nodes back to DB Structure
      const nodesToSave = nodes.map((n) => ({
        nodeKey: n.id,             // Maps 'id' -> 'nodeKey'
        title: n.data.label,       // Maps 'data.label' -> 'title'
        coords: n.position,        // Maps 'position' -> 'coords'
        isRequired: true           // Default
      }));

      // B. Convert ReactFlow Edges back to DB Structure
      const edgesToSave = edges.map((e) => ({
        sourceKey: e.source,       // Maps 'source' -> 'sourceKey'
        targetKey: e.target        // Maps 'target' -> 'targetKey'
      }));

      // C. Send Payload to Backend
      await adminService.updateRoadmap(roadmapId, {
        nodes: nodesToSave,
        edges: edgesToSave
      } as any);

      alert('✅ Roadmap layout saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save roadmap');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '0 20px', background: 'white', borderBottom: '1px solid #eee' }}>
        <Header 
          title={`Designing: ${roadmapTitle}`} 
          subtitle="Drag nodes to rearrange. Double-click a node to rename."
        />
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
          <button onClick={addNode} className="btn-primary" style={{ width: 'auto', padding: '8px 16px' }}>
            + Add Topic Node
          </button>
          <button onClick={handleSave} className="btn-primary" style={{ width: 'auto', padding: '8px 16px', background: '#10b981' }}>
            {saving ? 'Saving...' : '💾 Save Layout'}
          </button>
          <button onClick={() => navigate('/admin/roadmaps')} style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>
            Back to List
          </button>
        </div>
      </div>

      <div style={{ flex: 1, background: '#f8f9fa' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick} // 👈 Added Double Click Handler
          fitView
        >
          <Background color="#ccc" gap={20} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}