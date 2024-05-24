    import mongoose from "mongoose";

    const projectSchema = new mongoose.Schema(
        {
            projectName: {type: String, required: true},
            projectDescription: {type: String, required: true},
            projectSizeRange: {type: String, required: true},
            projectDeadline: {type: String, required: true},
            projectSector: {type: String, required: true},
            projectMembers: {type: Array, default: []},
            projectOwner: {type: String, required: true},
            country: {type: String, required: true},
            city: {type: String, required: true},
        },
        {
            timestamps: true
        }
    )

    const Project = mongoose.model('Project', projectSchema)
    export default Project