  const Description=require("../model/description");
const Team=require("../model/Team");
const Work=require("../model/Work");
async function createDescription(req,res)
{
    try{
      const{content}=req.body;
      const{workId,TeamId}=req.params;
      const Teamexists=await Team.findById(TeamId);
      if(!Teamexists)
      {
        return res.status(404).json({msg:"Team does not exists",success:false});
      }
      const workexists=await Work.findById(workId);
      if(!workexists)
      {
        return res.status(404).json({msg:"Team does not exists"});
      }
      if(!content)
      {
        return res.status(409).json({msg:"Please enter a content",success:false});
      }
      const NewDescription=await Description.create({
        TeamId:TeamId,
        ProjectId:workId,
        content,
      });
      return res.status(200).json({msg:"Description Added successfully",Description:NewDescription,success:true});
    }catch(error)
    {
      return res.status(500).json({msg:"Internal server error",success:false});
    }
}
module.exports={createDescription};