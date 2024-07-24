import { __ } from "@wordpress/i18n";
import { blockIcon } from "./utils/icons";

const { registerPlugin } = wp.plugins;
const { PanelBody, Button, __experimentalInputControl: InputControl } = wp.components;
const { PluginSidebar } = wp.editPost;

registerPlugin('map_key', {
  icon: blockIcon,
  render: () => {
    return <PluginSidebar className='bPlPluginSidebar' name="map_key" title={__("map api key", "osm-block")}>
      <PanelBody className='bPlPanelBody mcbPanelBody' title={__("Map Api Key", "osm-block")} initialOpen={true}>
        <p>Hello Coming..</p>
      </PanelBody>
    </PluginSidebar>
  }
});
