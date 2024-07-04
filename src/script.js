import OsmFront from './components/OsmFront/OsmFront';
import './style.scss';
import { createRoot } from 'react-dom/client';
// Block Name
function FrontEnd({ attributes, setAttributes }) {
	return (
		<>
			<OsmFront attributes={attributes} setAttributes={setAttributes}></OsmFront>
		</>
	);
}

const container = document.querySelectorAll('.wp-block-osm-hello');
container?.forEach(ele => {
	const attributes = JSON.parse(ele.dataset.attributes);
	const root = createRoot(ele);
	root.render(<FrontEnd attributes={attributes} />);
})