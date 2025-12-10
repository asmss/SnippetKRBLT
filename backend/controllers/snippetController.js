const mongoose = require("mongoose");
const Snippet = require("../models/snippet");
 
//yeni snippet kaydı oluşturuyorum burda vesselamm
exports.createSnippet = async (req,res) =>{
     const {userId,title,code} = req.body;
    try {
     const snippet = await Snippet.create({
        user:userId,
        title,
        code   
     })

     res.status(201).json({message:"snippet başarıyla oluşturuldu",snippet});

    } catch (error) {
        console.error("snippet oluşturulurken bir hatya oluştu",error);
        res.status(500).json({message:"snippet oluşturulamadı",error});
    }
 }

 //snippetlerin listesini getirme işlemi

 exports.getSnippets = async(req,res) =>{
      const {userId} = req.params;
      try {
          const snippets = await Snippet.find({user:userId});
          if(!snippets){
            return res.status(404).json({message:"bu kullanıcının snippet kaydı yok"});
          }
          res.status(200).json({message:"snippetler başarıyla getirildi",snippets});

      } catch (error) {
        console.error("snippetler getirilirken bir hata oluştu",error);
        res.status(500).json({message:"snippetler getirilemedi",error});
      }
}


exports.deleteSnippet = async(req,res)=>{
   const {snippetId} = req.params;
try {
       const snippet = await Snippet.findOneAndDelete(snippetId)

       if(!snippet){
            return res.status(404).json({message:"Silinecek snippet bulunamadı."});
       }
       res.status(200).json({message:"snippet başarıyla silindi"})

} catch (error) { 
  console.error("silinirken bir hatayla karşılaşıldı",error)
  res.status(500).json({message:"silinme hatası",error})
  
}
}



 