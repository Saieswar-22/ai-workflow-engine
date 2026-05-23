from sqlalchemy.orm import Session
from app.models.workflow import WorkflowExecution
from datetime import datetime

class WorkflowExecutor:
    def __init__(self, db: Session):
        self.db = db

    def start_execution(self, workflow_id: int) -> WorkflowExecution:
        execution = WorkflowExecution(
            workflow_id=workflow_id,
            execution_status="running",
            started_at=datetime.utcnow()
        )
        self.db.add(execution)
        self.db.commit()
        self.db.refresh(execution)
        return execution

    def complete_execution(self, execution_id: int, logs: list = None) -> WorkflowExecution:
        execution = self.db.query(WorkflowExecution).filter(WorkflowExecution.id == execution_id).first()
        if execution:
            execution.execution_status = "completed"
            execution.completed_at = datetime.utcnow()
            if logs:
                execution.logs = logs
            self.db.commit()
            self.db.refresh(execution)
        return execution

    def fail_execution(self, execution_id: int, logs: list = None) -> WorkflowExecution:
        execution = self.db.query(WorkflowExecution).filter(WorkflowExecution.id == execution_id).first()
        if execution:
            execution.execution_status = "failed"
            execution.completed_at = datetime.utcnow()
            if logs:
                execution.logs = logs
            self.db.commit()
            self.db.refresh(execution)
        return execution
