var canteenArr = [{"name":"err", "weight":100, "exp":false, "dis":false, "crd":false, "buf":false}];

var exExp = false, exDis = false, exCrd = false, exBuf = false, cnt_res = 0;

function initDetials()
{
    $("#dmheader").text($("#schools option:selected").html());
    // 创建表头
    $("#detailTable").empty();
    var table = $('<thead>').appendTo('#detailTable');
    var row = $('<tr>').appendTo(table);
    Object.keys(canteenArr[0]).forEach(function(key) {
        var s;
        if(key == "name") s = "名称";
        if(key == "weight") s = "权重";
        if(key == "exp") s = "贵";
        if(key == "dis") s = "远";
        if(key == "crd") s = "挤";
        if(key == "buf") s = "自选";
        $('<th>').text(s).appendTo(row);
    });

    // 创建表格内容
    var tbody = $('<tbody>').appendTo('#detailTable');
    initCheckboxes()
    canteenArr.forEach(function(obj) {
        var row;
        var exed = false;
        if((exExp && obj.exp) || (exDis && obj.dis) || (exCrd && obj.crd) || (exBuf && obj.buf))
        {
            row = $('<tr class="grey">').appendTo(tbody); 
            exed = true;
        }
        else row = $('<tr>').appendTo(tbody); 
        Object.keys(obj).forEach(function(key) {
            var value = obj[key];
            var s;
            if(value === true) s = "T";
            else if(value === false) s = "F";
            else s = value;
            if(key == "name" && exed) s = "<del>" + s + "</del>";
            if((key == "exp" && value && exExp) || (key == "dis" && value && exDis)
                || (key == "crd" && value && exCrd) || (key == "buf" && value && exBuf))
                $('<td class = "left orange marked">').html(s).appendTo(row);
            else $('<td>').html(s).appendTo(row);
      });
    });
}

function initCheckboxes()
{
    exExp = $("#poor").checkbox("is checked");
    exCrd = $("#crowd").checkbox("is checked");
    exDis = $("#weak").checkbox("is checked");
    exBuf = $("#trouble").checkbox("is checked");
}

function showDetails()
{
    initDetials();
    $("#detailModal").modal('show');
}

function loadSchool()
{
    var selected = document.getElementById('schools').value;
    $("#finalres").text("等待获取抽签结果...");
    canteenArr = [{"name":"err", "weight":100, "exp":false, "dis":false, "crd":false, "buf":false}];
    if(selected != "fff")
    {
        $("#btnWork").attr("class", "ui primary loading button");
        $("#btnShow").attr("class", "ui loading button");
        $("#btnWork").attr("disabled", true);
        $("#btnShow").attr("disabled", true);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', selected);
        xmlhttp.onreadystatechange = function ()
        {
            if (xmlhttp.readyState == xmlhttp.DONE)
            {
                canteenArr = JSON.parse(xmlhttp.responseText);
                $("#btnWork").attr("class", "ui primary button");
                $("#btnShow").attr("class", "ui button");
                $("#btnWork").attr("disabled", false);
                $("#btnShow").attr("disabled", false);
            }
        }
        xmlhttp.send()
    }
    else
    {
        $("#btnWork").attr("class", "ui primary button");
        $("#btnShow").attr("class", "ui button");
        $("#btnWork").attr("disabled", true);
        $("#btnShow").attr("disabled", true);
    }
}

function showHelp()
{
    $("#helpModal").modal('show');
}

function saveSettings()
{
    var storage = window.localStorage;
    initCheckboxes();
    if($("#schools").val() != "fff") storage["school"] = $("#schools").val();
    storage["poor"] = exExp;
    storage["weak"] = exDis;
    storage["crowd"] = exCrd;
    storage["trouble"] = exBuf;
    $('body').toast({
        class: 'success',
        displayTime: 500,
        message: "保存成功"
    });
}

function clearStorage()
{
    localStorage.clear();
    location.reload();
}

function getCanteen()
{
    var tot = 0;
    var res;
    var i = 0;
    initCheckboxes();
    for(i = 0; i < canteenArr.length; i++)
    {
        if((canteenArr[i].exp && exExp) || (canteenArr[i].crd && exCrd) || (canteenArr[i].dis && exDis) || (canteenArr[i].buf && exBuf))
            continue;
        tot += canteenArr[i].weight;
    }
    var r = Math.random() * tot;
    for(i = 0; i < canteenArr.length; i++)
    {
        if((canteenArr[i].exp && exExp) || (canteenArr[i].crd && exCrd) || (canteenArr[i].dis && exDis) || (canteenArr[i].buf && exBuf))
            continue;
        if(r <= canteenArr[i].weight)
        {
            res = canteenArr[i].name;
            break;
        }
        r -= canteenArr[i].weight;
    }
    $("#finalres").text(res);
    cnt_res++;
    $("#cntres").text(cnt_res);
}

$(document).ready(function(){  
    $('.ui.selection.dropdown').dropdown();
    if(window.localStorage["school"])
        $("#schools").dropdown("set selected", window.localStorage["school"], false);
    if(window.localStorage["poor"] == "true") $("#poor").checkbox("check");
    if(window.localStorage["weak"] == "true") $("#weak").checkbox("check");
    if(window.localStorage["crowd"] == "true") $("#crowd").checkbox("check");
    if(window.localStorage["trouble"] == "true") $("#trouble").checkbox("check");
    if($("#schools").val() != "fff")
    {
        $("#btnWork").attr("disabled", false);
        $("#btnShow").attr("disabled", false);
    }
    initCheckboxes();
    initDetials();
});