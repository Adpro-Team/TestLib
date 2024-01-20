var libList = ['yylj-offical'];
var libData = [];
fetch('../lib/yylj-offical.json5').then(data=>data.blob()).then(blob=>{
  const initReader = new FileReader();
  initReader.readAsText(blob,'UTF-8');
  initReader.onload = function(e){
    let script = e.target.result;
    libData.push(script);
  };
});

function getJsonArrayLength(jsonArray){
  let length = 0;
  for(let i in jsonArray){
    length++;
  }
  return length;
};

function getQuestion(data){
  let chioceArea = document.getElementById('a');
  let dataLength = getJsonArrayLength(data.data);
  let randomQ = Math.floor(Math.random()*dataLength);
  document.getElementById('q').innerHTML = data.data[randomQ].Q;
  let length = getJsonArrayLength(data.data[randomQ].choice);
  let randomPosition = Math.round(Math.random()*length);
  let j = 0;
  for(let i = 0; i <= length; i++){
    let btn = document.createElement('button');
    btn.setAttribute('id',`${i}`);
    btn.setAttribute('class','btn btn1');
    btn.setAttribute('type','button');
    btn.setAttribute('onclick',`judge(document.getElementById("choose").options[document.getElementById("choose").selectedIndex].value,${randomPosition},${i})`);
    chioceArea.appendChild(btn);
    btn = document.getElementById(`${i}`);
    if(i == randomPosition) btn.textContent = data.data[randomQ].A;
    else{
      btn.textContent = data.data[randomQ].choice[j];
      j++;
    }
  }
};

function readFile(libName){
  let libIndex = libList.indexOf(libName);
  let data = JSON5.parse(libData[libIndex]);
  document.getElementById('lib').innerText = `当前题库版本：${data.versionName}(${data.versionCode})`;
  getQuestion(data);
};

function judge(libName, correctAnswerLocation, index){
  let libIndex = libList.indexOf(libName);
  let data = JSON5.parse(libData[libIndex]);
  if(index == correctAnswerLocation){
    alert(data.prompt.correct);
    let chioceArea = document.getElementById('a');
    let childs = chioceArea.childNodes;
    for(let i = childs.length - 1; i >= 0; i--){
      chioceArea.removeChild(childs[i]);
    }
    getQuestion(data);
  }
  else alert(data.prompt.wrong);
};

function importLib(){
  const objFile = document.getElementById('import');
  if(objFile.value === ''){
      alert('请选择题库文件');
      return
  }
  const libFile = objFile.files;
  const reader = new FileReader();
  reader.readAsText(libFile[0],'UTF-8');
  reader.onload = function(e){
    let data = e.target.result;
    let jsonData = JSON5.parse(data);
    let libIndex = libList.indexOf(jsonData.libName);
    if(libIndex == -1){
      libData.push(data);
      libList.push(jsonData.libName);
      let selection = document.getElementById('choose');
      let optionTag = document.createElement('option');
      optionTag.setAttribute('value',jsonData.libName);
      optionTag.setAttribute('label',jsonData.name);
      selection.appendChild(optionTag);
      alert('导入成功！');
    }
    else{
      let oldData = JSON5.parse(libData[libIndex]);
      let userSelect = document.getElementById("choose");
      let index = userSelect.selectedIndex;
      if(jsonData.versionCode > oldData.versionCode){
        libData[libIndex] = data;
        alert('导入成功！已覆盖旧版本');
        let chioceArea = document.getElementById('a');
        let childs = chioceArea.childNodes;
        for(let i = childs.length - 1; i >= 0; i--){
          chioceArea.removeChild(childs[i]);
        }
        if(userSelect.options[index].value == jsonData.libName){
          document.getElementById('lib').innerText = `当前题库版本：${jsonData.versionName}(${jsonData.versionCode})`;
          getQuestion(jsonData);
        }
      }
      else if(jsonData.versionCode < oldData.versionCode) alert('导入失败！你已安装高版本');
      else{
        libData[libIndex] = data;
        alert('导入成功！已重新导入该题库');
        let chioceArea = document.getElementById('a');
        let childs = chioceArea.childNodes;
        for(let i = childs.length - 1; i >= 0; i--){
          chioceArea.removeChild(childs[i]);
        }
        if(userSelect.options[index].value == jsonData.libName){
          document.getElementById('lib').innerText = `当前题库版本：${jsonData.versionName}(${jsonData.versionCode})`;
          getQuestion(jsonData);
        }
      }
    }
  };
};