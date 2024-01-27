function generate() {
  //获取信息
  let getName = document.getElementById("name").value;
  let getAuthor = document.getElementById("author").value;
  let getVersionName = document.getElementById("versionName").value;
  let getVersionCode = document.getElementById("versionCode").value;
  let getDesc = document.getElementById("desc").value;
  let getLibName = document.getElementById("libName").value;
  let getCorrectAlert = document.getElementById("correct").value;
  let getWrongAlert = document.getElementById("wrong").value;
  let getData = document.getElementById('data').value;
  let data = getData.split(/[(\r\n)\r\n]+/);
  data.forEach((item, index) => {
    if (!item) data.splice(index, 1);
  });
  let QA = ``;
  data.forEach((item) => {
    let eachData = item.split(',');
    let length = eachData.length;
    let choice = ``;
    for(let i = 2; i < length; i++){
      choice += `'${eachData[i]}',`;
    }
    QA += `
      {
        Q: '${eachData[0]}',
        A: '${eachData[1]}',
        choice: [${choice}],
      },
    `;
  });
  let libTemplate = `
    {
      name: '${getName}',
      libName: '${getLibName}',
      desc: '${getDesc}',
      author: '${getAuthor}',
      versionName: '${getVersionName}',
      versionCode: ${getVersionCode},
      prompt: {
        correct: '${getCorrectAlert}',
        wrong: '${getWrongAlert}',
      },
      data: [
        ${QA}
      ],
    }
  `;
  let blob = new Blob([libTemplate],{
    type: 'application/json'
  });
  const downloadURL = URL.createObjectURL(blob);
  const aTag = document.createElement('a');
  aTag.href = downloadURL;
  aTag.download = `${getLibName}.json5`;
  aTag.click();
  URL.revokeObjectURL(downloadURL);
};

function readLib(type = false){
  const reader = new FileReader();
  if(type == false){
    const objFile = document.getElementById('upload');
    if(objFile.value === ''){
        alert('请选择题库文件');
        return
    }
    reader.readAsText(objFile.files[0],'UTF-8');
  }
  else{
    fetch('../lib/yylj-offical.json5').then(data=>data.blob()).then(result=>{
      reader.readAsText(result,'UTF-8');
    });
  }
  reader.onload = function(e){
    let data = e.target.result;
    data = JSON5.parse(data);
    document.getElementById("name").value = data.name;
    document.getElementById("author").value = data.author;
    document.getElementById("versionName").value = data.versionName;
    document.getElementById("versionCode").value = data.versionCode;
    document.getElementById("desc").value = data.desc;
    document.getElementById("libName").value = data.libName;
    document.getElementById("correct").value = data.prompt.correct;
    document.getElementById("wrong").value = data.prompt.wrong;
    let QA = ``;
    for(let i in data.data){
      let choice = ``;
      for(let j in data.data[i].choice){
        choice += `,${data.data[i].choice[j]}`
      }
      QA += `${data.data[i].Q},${data.data[i].A}${choice}\r`;
    }
    document.getElementById('data').value = QA;
  };
};