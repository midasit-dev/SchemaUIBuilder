import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IsSessionValid, GetToken } from '../Common/Login/SessionChecker';
import { fetchFunction } from '../Common/fetch';

// recoil
import { useSetRecoilState, useRecoilState } from 'recoil';
import { TokenState, AccState } from '../RecoilAtom/recoilHomeState';
import { FlowID } from '../RecoilAtom/recoilReactFlowState';

// components
import { SvgPlus } from './SVGComps';

// css
import './Recents.css';

export function UpdateTime({ updatedAt }) {
	const [timeAgo, setTimeAgo] = React.useState('');

	React.useEffect(() => {
		const calculateTimeAgo = () => {
			const now = new Date();
			const updatedTime = new Date(updatedAt);
			if (isNaN(updatedTime.getTime())) {
				setTimeAgo('');
				return;
			}
			const diffInMs = now - updatedTime; // 시간 차이 (밀리초)

			const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // 분
			const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // 시간
			const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // 일
			const diffInWeeks = Math.floor(diffInDays / 7); // 주
			const diffInMonths = Math.floor(diffInDays / 30); // 월
			const diffInYears = Math.floor(diffInDays / 365); // 년

			if (diffInYears >= 1) {
				setTimeAgo('last year');
			} else if (diffInMonths >= 1) {
				setTimeAgo(`${diffInMonths}달 전`);
			} else if (diffInWeeks >= 1) {
				setTimeAgo(`${diffInWeeks}주 전`);
			} else if (diffInDays >= 1) {
				setTimeAgo(`${diffInDays}일 전`);
			} else if (diffInHours >= 1) {
				setTimeAgo(`${diffInHours}시간 전`);
			} else if (diffInMinutes >= 1) {
				setTimeAgo(`${diffInMinutes}분 전`);
			} else {
				setTimeAgo('방금 전');
			}
		};

		calculateTimeAgo();
		const intervalId = setInterval(calculateTimeAgo, 60000); // 1분마다 업데이트

		return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 해제
	}, [updatedAt]);

	return <div className='recents-text'>{timeAgo}</div>;
}

function UserSavedFlowProject({ width, recentFlowProjects, onClickSavedFlow }) {
	return (
		<>
			{recentFlowProjects.map((flowProject) => {
				return (
					<div
						key={flowProject.flowProjectId}
						className='recents-wrapper'
						style={{ width: `calc(${width}px - 40px)`, height: width }}
						onClick={() => onClickSavedFlow(flowProject.flowProjectId)}
					>
						<div className='recents-thumbnail'>
							<img
								src={flowProject.thumbnailFileUrl}
								alt='Thumbnail'
								style={{ width: '100%', height: '100%' }}
							/>
						</div>
						<div className='recents-title'>{flowProject.title}</div>
						<UpdateTime updatedAt={flowProject.updatedAt} />
					</div>
				);
			})}
		</>
	);
}

async function postNewFlowProject(token) {
	const res = await fetchFunction({
		baseUrl: `${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/flow-projects`,
		method: 'POST',
		tokenHeaderKey: 'Authorization',
		token: token,
		body: JSON.stringify({ title: 'Untitled' }),
	});

	if (res && res.ok) {
		const data = await res.json();
		return data;
	}
	return null;
}

function NewFlowProject({ width, onClickNewFlow }) {
	const [isHovered, setIsHovered] = React.useState(false);

	return (
		<div
			className='new-container'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{ width: `calc(${width}px - 40px)`, height: `calc(${width}px - 18px` }}
			onClick={onClickNewFlow}
		>
			<div className='new-inner'>
				<div className='new-icon-container'>
					<SvgPlus isHovered={isHovered} />
				</div>
			</div>
			<div className='new-text'>New Flow Project</div>
		</div>
	);
}

export default function Recents(props) {
	const { width = '200px', flowProjectList } = props;

	const setFlowID = useSetRecoilState(FlowID);
	const [token, setToken] = useRecoilState(TokenState);
	const [acc, setAcc] = useRecoilState(AccState);

	const navigate = useNavigate();

	const onClickNewFlow = async () => {
		let newToken = '';
		const isValid = await IsSessionValid(token);
		if (!isValid || isValid === 'token is empty') {
			console.log('token is invalid');
			const newTokenResult = await GetToken(acc);
			if (newTokenResult === 'acc is empty' || newTokenResult === 'token issuance failed') {
				console.error(newTokenResult);
				navigate('../login');
			} else {
				setToken(newTokenResult);
				newToken = newTokenResult;
			}
		} else newToken = token;

		const response = await postNewFlowProject(newToken);
		if (response && response.flowProjectId) {
			const flowId = response.flowProjectId;
			if (flowId && flowId !== '') {
				setFlowID(flowId);
				navigate(`../Flow/${flowId}`);
			}
		} else {
			console.error('Failed to create new flow project');
			return;
		}
	};

	const onClickSavedFlow = async (flowId) => {
		setFlowID(flowId);
		navigate(`../flow/${flowId}`);
	};

	return (
		<>
			<NewFlowProject width={width} onClickNewFlow={onClickNewFlow} />
			{flowProjectList && flowProjectList.length !== 0 && (
				<UserSavedFlowProject
					width={width}
					recentFlowProjects={flowProjectList}
					onClickSavedFlow={onClickSavedFlow}
				/>
			)}
		</>
	);
}
