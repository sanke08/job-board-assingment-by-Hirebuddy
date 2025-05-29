// lib/modals.ts
import mongoose from "mongoose"

const JobSchema = new mongoose.Schema({
    company_name: String,
    job_title: String,
    job_location: String,
    apply_link: String,
    job_description: String,
    source: String
}, {
    timestamps: true
})


export const Job = mongoose.models.job || mongoose.model("job", JobSchema)



// // lib/models/location.ts
// const LocationSchema = new mongoose.Schema({
//     name: { type: String, required: true, unique: true },
// });

// // Create index for faster searching
// LocationSchema.index({ name: "text" });

// export const Location = mongoose.models.location || mongoose.model("location", LocationSchema);





// const JobTitleSchema = new mongoose.Schema({
//     name: { type: String, required: true, unique: true },
// });

// // Create text index on the name field
// JobTitleSchema.index({ name: "text" });

// export const JobTitle = mongoose.models.jobTitle || mongoose.model("jobTitle", JobTitleSchema);




// const CompanySchema = new mongoose.Schema({
//     name: { type: String, required: true, unique: true },
// });

// CompanySchema.index({ name: "text" }); // Text index for search

// export const Company =
//     mongoose.models.company || mongoose.model("company", CompanySchema);