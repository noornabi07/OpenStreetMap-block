import "./mediaArea.css";
const { MediaUpload } = wp.blockEditor;

export const MediaArea = (props) => {
  const {
    types = ['image'],
    value,
    onChange = () => { },
    default: defaults = "",
    height = '50px',
    width = '50px',
    label = 'Choose SVG',
    style,
    className
  } = props;
  return (
    <>
      <div style={style} className={`custom-media-area-component ${className}`}>
        <MediaUpload
          gallery={false}
          onSelect={(value) => onChange(value)}
          value={value}
          allowedTypes={types}
          render={({ open }) => (
            <div className="media-area-container">
              {
                defaults ? <img
                  onClick={open}
                  style={{ height, width }}
                  className="media-area-image"
                  src={value?.url || defaults}
                  alt=""
                /> : value?.url ? <img
                  onClick={open}
                  style={{ height, width }}
                  className="media-area-image"
                  src={value?.url || defaults}
                  alt=""
                /> : <div className='media-plusBtn-wrapper' onClick={open}>
                  <div className='mediaPlus-btn-circle'>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="mediaPlusBtn" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                  </div>
                </div>
              }
              <div onClick={() => onChange('')} className="media-delete">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg>
              </div>
              <div onClick={open} className="media-bottom">
                <span>{label}</span>
              </div>
            </div>
          )}
          multiple={false}
        />
      </div>
    </>
  );
};