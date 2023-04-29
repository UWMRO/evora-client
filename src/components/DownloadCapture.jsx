function DownloadCapture({downloadPath}) {

    function downloadUrl(downloadPath){
        
        window.open(downloadPath, '_self');
    }

    return (
    <fieldset>
      <button onClick={downloadUrl}>Download File</button> 
      <text>{downloadPath}</text>
    </fieldset>
    );
  }
  
  
  
  export default DownloadCapture;