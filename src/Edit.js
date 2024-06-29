import { useEffect, Fragment } from 'react';
import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
import ContentSetting from './components/Settings/ContentSetting/ContentSetting';
import { useMap } from 'react-leaflet';
import OsmBackend from './components/OsmBack/OsmBackend';
import Style from './components/Settings/StyleSetting/Style';
const Edit = props => {
	const { className, setAttributes, clientId, attributes } = props;

	const { tab, isMouseZoom, zoomUnit } = attributes;

	useEffect(() => {
		clientId && setAttributes({ cId: clientId.substring(0, 10) });
	}, [clientId, zoomUnit, isMouseZoom]); // Set & Update clientId to cId

	const setPosition = (lat, lng) => {
		setAttributes({ settingsLat: lat, settingsLng: lng });
	};

	const OSMMap = ({ position }) => {
		const map = useMap();

		useEffect(() => {
			if (position) {
				map.setView(position, 13);
			}
		}, [position]);

		return null;
	};


	return <div className={className}>
		<Fragment>
			<InspectorControls>
				<TabPanel
					className="my-tab-panel"
					activeClass="active-tab"
					orientation="horizontal"
					initialTabName={tab.activeTab}
					onSelect={(tabName) => setAttributes({ tab: { activeTab: tabName } })}
					tabs={[
						{
							name: 'tab1',
							title: 'Content',
							icon: 'admin-generic',
							className: 'tab-one',
						},
						{
							name: 'tab2',
							title: 'Styles',
							icon: 'dashboard',
							className: 'tab-two',
						},
					]}>
					{(tab) => (
						<div className='myTabPanel'>
							{
								tab.name === 'tab1' && <ContentSetting attributes={attributes} setAttributes={setAttributes} setPosition={setPosition}></ContentSetting>
							}
							{
								tab.name === 'tab2' && <Style attributes={attributes} setAttributes={setAttributes}></Style>
							}
						</div>
					)
					}

				</TabPanel>
			</InspectorControls>

			<OsmBackend attributes={attributes} OSMMap={OSMMap} setAttributes={setAttributes} setPosition={setPosition}></OsmBackend>
		</Fragment>
	</div>;
};
export default Edit;