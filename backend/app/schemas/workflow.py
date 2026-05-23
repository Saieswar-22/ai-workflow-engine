from pydantic import BaseModel
from typing import Optional, Any, Dict, List
from datetime import datetime

class WorkflowExecutionBase(BaseModel):
    execution_status: str
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    logs: Optional[List[Dict[str, Any]]] = []

class WorkflowExecutionCreate(WorkflowExecutionBase):
    workflow_id: int

class WorkflowExecutionUpdate(WorkflowExecutionBase):
    pass

class WorkflowExecutionResponse(WorkflowExecutionBase):
    id: int
    workflow_id: int

    class Config:
        from_attributes = True

class WorkflowBase(BaseModel):
    workflow_name: str
    workflow_json: Optional[Dict[str, Any]] = {}

class WorkflowCreate(WorkflowBase):
    pass

class WorkflowUpdate(WorkflowBase):
    workflow_name: Optional[str] = None
    workflow_json: Optional[Dict[str, Any]] = None

class WorkflowResponse(WorkflowBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    executions: List[WorkflowExecutionResponse] = []

    class Config:
        from_attributes = True
