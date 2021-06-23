import XLSX from "xlsx";
import React from 'react';
import { Upload, Button, Table, message } from 'antd';
import axios from 'axios';



export class Updatexlsx extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], //主要数据
            dataKey: [], //jsonKey值

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
    updateData(){
        console.log("ONclick")
        try{
        axios.post(this.props.backendUrl, {
            data:this.state.data,
            time:new Date()
        }).then((res) => {
            let successInfo = "成功"
            
            if (res.data.success === true) {
                message.success({ content: res.data.info, successInfo  , duration: 2 })
            }else {
                message.error({ content: res.data.info,  duration: 2 })
              }
        }
            
            
            )
    }catch(e){
        message.error(e);
    }

    }
    showTable(dataKey, dataObj ,visable) {
        if (dataObj.length !== 0 && visable) {
            var columns = [];
            var dataSoure =[];
            dataKey.forEach( (item) => {
                columns.push({
                    title: item,
                    dataIndex: item,
                    key: item

                })
            })
            var key = 0 ;
            dataObj.forEach((obj)=>{
                dataSoure.push({
                    key:key,
                    obj
                })
                key++
            })

            return (
                <><Table dataSource={dataObj} columns={columns} /><Button onClick={() => this.updateData()}> 上传</Button></>

                );
        } else {
            return <></>;
        }

    }
    onRemove(file) {
        this.setState({
            data: [],
            dataKey: []

        })

    }


    render() {

        return (
            <>
                <Upload name="excel"  listType="text" onRemove={this.onRemove} customRequest={this.loadxlsx} accept="file" showUploadList={true}>

                    <Button>
                        点击选择报表

                    </Button>

                </Upload>
                {this.showTable(this.state.dataKey, this.state.data ,this.props.tableVisable)}
                

            </>


        )
    }



}

