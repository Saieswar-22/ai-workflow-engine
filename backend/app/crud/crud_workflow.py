from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.workflow import Workflow, WorkflowExecution
from app.schemas.workflow import WorkflowCreate, WorkflowUpdate

def create_workflow(db: Session, *, workflow_in: WorkflowCreate, user_id: int) -> Workflow:
    db_obj = Workflow(
        user_id=user_id,
        workflow_name=workflow_in.workflow_name,
        workflow_json=workflow_in.workflow_json
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_workflows_by_user(db: Session, *, user_id: int, skip: int = 0, limit: int = 100) -> List[Workflow]:
    return db.query(Workflow).filter(Workflow.user_id == user_id).offset(skip).limit(limit).all()

def get_workflow_by_id(db: Session, *, workflow_id: int) -> Optional[Workflow]:
    return db.query(Workflow).filter(Workflow.id == workflow_id).first()

def update_workflow(db: Session, *, db_obj: Workflow, workflow_in: WorkflowUpdate) -> Workflow:
    update_data = workflow_in.model_dump(exclude_unset=True)
    for field in update_data:
        setattr(db_obj, field, update_data[field])
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_workflow(db: Session, *, workflow_id: int) -> Workflow:
    obj = db.query(Workflow).get(workflow_id)
    db.delete(obj)
    db.commit()
    return obj
