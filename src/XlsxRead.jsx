import XLSX from "xlsx";
import React from 'react';
import { Upload, Button, Table, message } from 'antd';
import axios from 'axios';

const XlsxTable =(props) => {
    var columns = [];
    console.log(props.dataKey)
    var key = 0
    props.dataKey.forEach((item) => {
        columns.push({
            title: item,
            dataIndex: item,
            key: key

        })
        key++
    });
    
  
    return (
        <><Table dataSource={props.columnsValue} columns={columns} /></>

    );

}

export class Updatexlsx extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], //主要数据
            dataKey: [], //jsonKey值
            canUpdateData: [], //验证后的值
            columnsValue: [] // 表渲染值


        }
        this.loadxlsx = this.loadxlsx.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }


    loadxlsx(options) {
        // const [res,setRes] = useState(undefined);
        console.log(options)

        var excelBuffer = new FileReader();
        excelBuffer.readAsBinaryString(options.file);
        //console.log(excelBuffer.readAsBinaryString(file));
        excelBuffer.onloadend = res => {
            try {
                var workbook = XLSX.read(res.target.result, { type: 'binary', cellDates: true, cellStyles: true });
                var sheetName = workbook.SheetNames;
                var sheet1 = workbook.Sheets[sheetName[0]];
                var json = XLSX.utils.sheet_to_json(sheet1);
                var keyObj = [];

                if (this.state.data.length === 0) {
                    for (var key in json[0]) {
                        keyObj.push(key)
                    }
                    this.setState({
                        data: json,
                        dataKey: keyObj

                    })
                } else {
                    json.forEach((item) => {
                        this.setState({
                            data: [...this.state.data, item],

                        })
                    })

                }

                options.onSuccess();
                this.checkValue(this.props.rules)

            } catch (e) {
                console.log(e);
                options.onError();
            }
        }
    }
    componentDidUpdate() {


    }
    componentWillUnmount() {

    }
    onRemove() {
        this.setState({
            data: [],
            dataKey: []

        })

    }
    updateData() {

        try {
            axios.post(this.props.backendUrl, {
                data: this.state.canUpdateData,
                key: this.state.dataKey,
                time: new Date()
            }).then((res) => {
                let successInfo = "成功"
                let errorInfo = "发送失败"

                if (res.status === 200) {
                    message.success({ content: res.status, successInfo, duration: 2 })
                } else {
                    message.error({ content: res.status, errorInfo, duration: 2 })
                }
            }


            )
        } catch (e) {
            message.error(e);
        }

    }
    checkValue(rules){
        var dataSoure = [];
        // eslint-disable-next-line no-cond-assign
        if (this.state.data.length !== 0) {
            const msgkey = 'updatable';
            if (rules.length === this.state.dataKey.length) {
                var flag = true
                var i = 0;
                for (i = 0; i < rules.length; i++) {
                    console.log(i);
                    if (rules[i] === this.state.dataKey[i]) {
                        
                    }
                    else {

                        flag = false
                       
                        message.error({ content: '读取失败' + rules[i] + '不与表中' + this.state.dataKey[i] + '相同', msgkey, duration: 3 });
                      break;

                    }
                }


              
                if (flag) {
                    var keyValue = 0;
                    this.state.data.forEach((obj) => {
                        let key = { key: keyValue }
                        dataSoure.push({
                            ...key, ...obj
                        })
                        keyValue++
                    });
                  
                    this.setState({
                        columnsValue:dataSoure,
                        canUpdateData:this.state.data           
                    })
                    
                    message.success({ content: '读取成功', msgkey, duration: 2 });
                    this.onRemove();
                    


                  
                 
                } else {
                    this.onRemove();
                }
            } else {
                message.error({ content: '失败，文档不合规。值' + this.state.dataKey[rules.length] + "不存在", msgkey, duration: 2 });
                this.onRemove()
            }
        }
    

    }

    





    render() {

        return (
            <>
                <Upload name="excel" listType="text" onRemove={this.onRemove} customRequest={this.loadxlsx} accept="file" showUploadList={this.props.showUploadList}>

                    <Button>
                        点击选择报表

                    </Button>

                </Upload>
                <XlsxTable dataKey={this.props.rules} columnsValue={this.state.columnsValue}/>
                <Button onClick={()=>this.updateData()}>点击上传</Button>


            </>


        )
    }



}

