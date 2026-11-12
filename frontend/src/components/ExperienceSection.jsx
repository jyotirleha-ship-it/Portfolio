import React from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";

export default function ExperienceSection({ experience = [] }) {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">04 // Practical Trajectory</span>
          <h2 className="section-title">Experience & Milestones</h2>
          <p className="section-sub">
            Demonstrated engineering achievements across academic systems research, open-source projects, and full-stack development.
          </p>
        </div>

        <div className="timeline-track">
          {experience.map((item, idx) => (
            <div key={item.id || item._id || idx} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <span className="timeline-date-badge">
                  {item.startDate} — {item.endDate} {item.current ? "(Active)" : ""}
                </span>
                <h3>{item.role}</h3>
                <h4>{item.company} // {item.location}</h4>

                <ul>
                  {(item.highlights || []).map((point, pIdx) => (
                    <li key={pIdx}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
