import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { FaUserTie, FaBriefcase, FaGraduationCap } from 'react-icons/fa';

const ResumeCard = ({ resume, onViewDetails }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaUserTie className="me-2" />
            {resume.title}
          </h5>
          <Badge bg="light" text="dark">
            {resume.category}
          </Badge>
        </div>
      </Card.Header>
      
      <Card.Body>
        <Card.Text className="text-muted mb-3">
          {resume.summary}
        </Card.Text>
        
        {resume.experience && (
          <div className="mb-3">
            <FaBriefcase className="me-2 text-secondary" />
            <strong>Experience:</strong> {resume.experience}
          </div>
        )}
        
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-3">
            <h6>Key Skills:</h6>
            <div className="d-flex flex-wrap gap-1">
              {resume.skills.map((skill, index) => (
                <Badge key={index} bg="secondary" className="me-1 mb-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
      
      <Card.Footer className="bg-transparent">
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={() => onViewDetails(resume)}
        >
          View Details
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ResumeCard;