import React, { useCallback } from 'react';
import ReactFlow, {
	addEdge,
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
} from 'reactflow';

import { nodes as initialNodes, edges as initialEdges } from './initial-elements';
import AnnotationNode from './AnnotationNode';
import ToolbarNode from './ToolbarNode';
import ResizerNode from './ResizerNode';
import CircleNode from './CircleNode';
import TextNode from './TextNode';
import ButtonEdge from './ButtonEdge';
import TestNode from './TestNode';

import 'reactflow/dist/style.css';
import './overview.css';

// recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { Nodetypes, SelectedSchema } from '../RecoilAtom/recoilState';

const nodeTypes = {
	annotation: AnnotationNode,
	tools: ToolbarNode,
	resizer: ResizerNode,
	circle: CircleNode,
	textinput: TextNode,
	schemaUI: TestNode,
};

const edgeTypes = {
	button: ButtonEdge,
};

const nodeClassName = (node) => node.type;

const ReactFlowComp = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [nodetypes, setNodetypes] = useRecoilState(Nodetypes);
	const selectedschema = useRecoilValue(SelectedSchema);

	React.useEffect(() => {
		console.log(selectedschema);
		setNodetypes((prevNodetype) => {
			return { ...prevNodetype, selectedschema };
		});
	}, [selectedschema]);

	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				fitView
				attributionPosition='top-center'
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				className='overview'
			>
				<MiniMap zoomable pannable nodeClassName={nodeClassName} />
				<Controls />
				<Background />
			</ReactFlow>
		</div>
	);
};

export default ReactFlowComp;
