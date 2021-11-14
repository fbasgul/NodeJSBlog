const moment=require("moment")

module.exports={
        generateDate:(date,format)=>{
        return moment(date).format(format)
        },
        limit:(arr,limit)=>{
            if(!Array.isArray(arr)){return []}
        return arr.slice(0,limit)
        },
        truncate:(str,len)=>{
            if(str.length>len) str=str.substring(0,len)+"..."
        return str
        },
        paginate:(options)=>{
            let outputHTML=''
            if(options.hash.current===1){
                outputHTML+='<li class="page-item disabled"><a class="page-link">First</a></li>'
            } else {
                outputHTML+='<li class="page-item"><a class="page-link" href="?page=1">First</a></li>'
            }
            let arasayfalar=(Number(options.hash.current) > 5 ? Number(options.hash.current) - 3: 1)
            if(arasayfalar!=1){
                outputHTML+='<li class="page-item disabled"><a class="page-link"">...</a></li>'
            }
                for (; arasayfalar <= (Number(options.hash.current) + 3) && arasayfalar <= options.hash.pages; arasayfalar++){
                    if(arasayfalar===options.hash.current){
                        outputHTML+='<li class="page-item active"><a class="page-link">'+arasayfalar+'</a></li>'
                    } else {
                        outputHTML+='<li class="page-item"><a class="page-link" href="?page='+arasayfalar+'">'+arasayfalar+'</a></li>'
                    }
                    if (arasayfalar == Number(options.hash.current) + 3 && arasayfalar < options.hash.pages){
                        outputHTML+='<li class="page-item disabled"><a class="page-link">...</a></li>'
                    }
                }
            if (options.hash.current==options.hash.pages){
                outputHTML+='<li class="page-item disabled"><a class="page-link">Last</a></li>'
            } else {
                outputHTML+='<li class="page-item"><a class="page-link" href="?page='+options.hash.pages+'">Last</a></li>'
            }
            return outputHTML
        }
    }