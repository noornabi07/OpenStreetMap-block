import { registerBlockType } from '@wordpress/blocks';
import metadata from '../inc/block.json';
import Edit from './Edit';
import './editor.scss';

registerBlockType(metadata, {
	icon: {
		src: 'location-alt',
		foreground: '#604CC3',
		background: '#fff',
	},

	// Build in Functions
	edit:Edit,

	save: () =>null,
});
