(function () {
  const BUCKET = 'renke';
  const params = window.location.href.split('#')[1].split('&');
  let idToken = '';
  for (let i=0; i<params.length; i++) {
    if (params[i].indexOf('id_token') == 0) {
      idToken = params[i].split('=')[1];
    }
  }
  
  // https://stackoverflow.com/questions/45926339/cognito-hosted-ui
  // Set the region where your identity pool exists (us-east-1, eu-west-1)
  AWS.config.region = 'us-west-2';
  
  // Configure the credentials provider to use your identity pool
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-west-2:4dda5aa3-958a-48fb-8581-cfafd7f7fdc3',
      Logins: {
        'cognito-idp.us-west-2.amazonaws.com/us-west-2_kAIcqw6Pf': idToken
      }
  });
  
  let s3 = new AWS.S3()
  
  s3.listObjectsV2({Bucket: BUCKET}, function (err, data) {
    if (err) console.log(err, err.stack);
    else {
      const contents = data['Contents'];
      for (let i=0; i<contents.length; i++) {
        let el = document.querySelector('#dummy').cloneNode(true);
        el.removeAttribute('style');
        el.querySelector('a').innerHTML = contents[i]['Key'];
        el.querySelector('a').setAttribute('href', s3.getSignedUrl('getObject', {Bucket: BUCKET, Key: contents[i]['Key']}));
        document.querySelector('#list').appendChild(el);
      }
    }
  });
  
  // upload 
  function upload() {
    const file = document.querySelector("input#upload").files[0];
    if (file == undefined) {
      console.log('file empty');
      return;
    }
    
    const params = {
      Body: file,
      Bucket: BUCKET,
      Key: file['name']
     };
    s3.putObject(params, function (err, data) {
      if (err) console.log(err);
      else {
        console.log('success');
        console.log(data);
      }
    });
  }
  document.querySelector('button#upload').addEventListener('click', upload);
  
})();
