from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.crud import crud_workflow
from app.models.user import User
from app.schemas.workflow import WorkflowCreate, WorkflowResponse, WorkflowUpdate, WorkflowExecutionResponse
from app.services.workflow_executor import WorkflowExecutor

router = APIRouter()

@router.post("/create", response_model=WorkflowResponse)
def create_workflow(
    *,
    db: Session = Depends(deps.get_db),
    workflow_in: WorkflowCreate,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Create new workflow.
    """
    workflow = crud_workflow.create_workflow(db=db, workflow_in=workflow_in, user_id=current_user.id)
    return workflow

@router.get("/list", response_model=List[WorkflowResponse])
def get_workflows(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Retrieve workflows.
    """
    workflows = crud_workflow.get_workflows_by_user(db=db, user_id=current_user.id, skip=skip, limit=limit)
    return workflows

@router.get("/{id}", response_model=WorkflowResponse)
def get_workflow(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get workflow by ID.
    """
    workflow = crud_workflow.get_workflow_by_id(db=db, workflow_id=id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return workflow

@router.put("/update/{id}", response_model=WorkflowResponse)
def update_workflow(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    workflow_in: WorkflowUpdate,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Update a workflow.
    """
    workflow = crud_workflow.get_workflow_by_id(db=db, workflow_id=id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    workflow = crud_workflow.update_workflow(db=db, db_obj=workflow, workflow_in=workflow_in)
    return workflow

@router.delete("/delete/{id}", response_model=WorkflowResponse)
def delete_workflow(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Delete a workflow.
    """
    workflow = crud_workflow.get_workflow_by_id(db=db, workflow_id=id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    workflow = crud_workflow.delete_workflow(db=db, workflow_id=id)
    return workflow

@router.post("/{id}/execute", response_model=WorkflowExecutionResponse)
def execute_workflow(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Execute a workflow.
    """
    workflow = crud_workflow.get_workflow_by_id(db=db, workflow_id=id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    executor = WorkflowExecutor(db)
    execution = executor.start_execution(workflow_id=id)
    
    # Simulate immediate completion for now
    execution = executor.complete_execution(execution_id=execution.id, logs=[{"message": "Execution finished successfully"}])
    return execution
